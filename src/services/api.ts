import { loginSchema } from "@/services/schemas";
import { WorkerDTO } from "@/types/types";
import { VitalPatch } from "@/types/vitals";
import { z } from "zod";
import { transformForApi } from "@/services/transformData";
import { UserDTO } from "@/types/workerTypes";

export const API_URL = process.env.API_URL;

const login = async (form: z.infer<typeof loginSchema>) => {
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  if (!response.ok) {
    throw new Error("Failed to login");
  }
  const data: UserDTO = await response.json();
  return data;
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
  const response = await fetch(`${API_URL}/patients`, {});
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }
  return await response.json();
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
    },
    body: JSON.stringify({
      name: worker.name,
      phone: worker.phone,
      teamID: worker.teamID,
      status: worker.status,
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
      teamID: worker.teamID,
      status: worker.status,
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

  console.log(formattedData);

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
  console.log(res);
  return res;
};

export {
  fetchClients,
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
};
