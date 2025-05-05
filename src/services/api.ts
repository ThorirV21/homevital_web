import { loginSchema } from "@/services/schemas";
import { WorkerDTO } from "@/types/types";
import { VitalPatch } from "@/types/vitals";
import { z } from "zod";
import { transformForApi } from "@/services/transformData";
import { parseJwt } from "@/lib/utils";
import { getSession, saveSession } from "@/services/session";
import { Team, TeamPost } from "@/types/teamTypes";
import { Client } from "@/types/clientTypes";
import { TreatmentPost } from "@/types/treatmentTypes";
import { api } from "@/lib/api";

export const API_URL = process.env.API_URL;

//TODO: Klára að refaktora, nota @/lib/api (authorized api calls)

const login = async (form: z.infer<typeof loginSchema>) => {
  const session = await getSession();
  const response = await fetch(`${API_URL}/user/generate-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const data = await response.json();
  const token = parseJwt(data.token);

  if (!token) {
    throw new Error("Token is missing");
  }

  if (
    !token[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ].includes("HealthcareWorker")
  ) {
    throw new Error("Invalid token");
  }

  const user = await fetch(`${API_URL}/healthcareworkers/${token.sub}`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
  if (!user.ok) {
    console.error("Failed to fetch healthcare worker data");
  }
  const userData = await user.json();

  session.isLoggedIn = true;
  session.userId = token.sub;
  session.user = {
    id: userData.id,
    name: userData.name,
    phone: userData.phone,
    status: userData.status,
    role: token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    groups: userData.teamIDs,
  };

  session.token = data.token;

  await saveSession(session);

  return session;
};

const mockLogin = async (form: z.infer<typeof loginSchema>) => {
  const response = await fetch(`${API_URL}/user/MockLogin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  if (!response.ok) {
    throw new Error("Failed to login");
  }
  return await response.json();
};

const fetchClients = async () => {
  const response = await api.get("/patients");
  return response;
};

const createClient = async (client: Client) => {
  const response = await api.post("/patients", client);

  return response;
};

const updateClient = async (client: Client) => {
  const response = await fetch(`${API_URL}/patients/${client.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });
  if (!response.ok) {
    throw new Error("Failed to update client");
  }
  return await response.json();
};

const deleteClient = async (id: string) => {
  const response = await fetch(`${API_URL}/patients/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete client");
  }
};

const fetchClientDetails = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch client details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching client details: ", error);
    return null;
  }
};

const fetchClientMeasurements = async (id: string) => {
  const url = new URL(`${API_URL}/measurements/${id}`);
  //url.searchParams.append("id", id);

  const response = await fetch(url.toString(), {
    cache: "no-cache",
  });
  if (!response.ok) {
    console.error("Failed to fetch client measurements");
    //throw new Error("Failed to fetch client measurements");
  }
  const data = await response.json();
  return data;
};

const fetchHealthcareWorkers = async () => {
  const response = await fetch(`${API_URL}/healthcareworkers`);
  if (!response.ok) {
    throw new Error("Failed to fetch healthcare workers");
  }
  return await response.json();
};

const fetchHealthcareWorker = async (id: string) => {
  const response = await fetch(`${API_URL}/healthcareworkers/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch healthcare worker");
  }
  return await response.json();
};

const createHealthcareWorker = async (worker: WorkerDTO) => {
  const response = await fetch(`${API_URL}/healthcareworkers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    body: JSON.stringify({
      name: worker.name,
      phone: worker.phone,
      teamIDs: worker.teamIDs,
      status: worker.status,
      kennitala: worker.ssn,
    }),
  });
  if (!response.ok) {
    console.error("Failed to create healthcare worker", response.json());
  }
  return await response.json();
};

const updateHealthcareWorker = async (worker: WorkerDTO) => {
  const response = await fetch(`${API_URL}/healthcareworkers/${worker.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: worker.name,
      phone: worker.phone,
      teamIDs: worker.teamIDs,
      status: worker.status,
      kennitala: worker.ssn,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update healthcare worker");
  }
  return await response.json();
};

const deleteHealthcareWorker = async (id: string) => {
  const response = await fetch(`${API_URL}/healthcareworkers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete healthcare worker");
  }
  return await response.json();
};

const fetchVitalRanges = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/vitalrange/${id}`, {
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch vital ranges");
    }
    const data = await response.json();
    return (
      data || {
        bloodPressureRange: { id, patientID: id },
        bloodSugarRange: { id, patientID: id },
        bodyTemperatureRange: { id, patientID: id },
        oxygenSaturationRange: { id, patientID: id },
        bodyWeightRange: { id, patientID: id },
      }
    );
  } catch (error) {
    console.error("Error fetching vital ranges:", error);
    return {
      bloodPressureRange: { id, patientID: id },
      bloodSugarRange: { id, patientID: id },
      bodyTemperatureRange: { id, patientID: id },
      oxygenSaturationRange: { id, patientID: id },
      bodyWeightRange: { id, patientID: id },
    };
  }
};

const updateVitalRange = async (data: VitalPatch) => {
  const formattedData = transformForApi({
    id: data.id,
    patientId: data.clientId,
    name: data.type,
    ranges: data.data,
    distolicRanges: data?.distolicRanges,
  });

  const response = await fetch(
    `${API_URL}/vitalrange/${data.type}/${data.clientId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(formattedData),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update vital range");
  }
  const res = await response.json();
  return res;
};

const fetchTeams = async () => {
  const response = await api.get("/teams");

  return response;
};

const fetchCreateTeam = async (team: TeamPost) => {
  const response = await api.post("/teams", { name: team.name });

  return response;
};

const fetchUpdateTeam = async (team: Team) => {
  const response = await api.patch(`/teams/${team.id}`, team);

  return response;
};

const fetchDeleteTeam = async (id: string) => {
  const response = await fetch(`${API_URL}/teams/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete team");
  }
  return await response.json();
};

const postTreatment = async (treatment: TreatmentPost) => {
  const response = await fetch(`${API_URL}/patientplans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(treatment),
  });
  if (!response.ok) {
    throw new Error("Failed to create treatment");
  }
  return await response.json();
};

const fetchTreatments = async (id: string) => {
  //TODO: Handle date strings, turn into date objects
  const response = await fetch(`${API_URL}/patientplans/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch treatments");
  }
  return await response.json();
};

const fetchPatientTreatments = async (id: string) => {
  const response = await fetch(`${API_URL}/patientplans/patient/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch treatments");
  }
  return await response.json();
};

const fetchAlarms = async () => {
  const response = await fetch(`${API_URL}/measurements/warnings`);
  if (!response.ok) {
    throw new Error("Failed to fetch alarms");
  }
  return await response.json();
};

export {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  fetchClientDetails,
  fetchClientMeasurements,
  login,
  mockLogin,
  fetchHealthcareWorkers,
  createHealthcareWorker,
  updateHealthcareWorker,
  deleteHealthcareWorker,
  fetchVitalRanges,
  updateVitalRange,
  fetchHealthcareWorker,
  fetchTeams,
  fetchCreateTeam,
  fetchUpdateTeam,
  fetchDeleteTeam,
  postTreatment,
  fetchTreatments,
  fetchPatientTreatments,
  fetchAlarms,
};
