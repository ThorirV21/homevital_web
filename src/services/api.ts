import { loginSchema } from "@/services/schemas";
import { z } from "zod";
import { parseJwt } from "@/lib/utils";
import { getSession, saveSession } from "./session";
import { redirect } from "next/navigation";
export const API_URL = process.env.API_URL;

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

  console.log(token);

  const user = await fetch(`${API_URL}/healthcareworkers/${token.sub}`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
  if (!user.ok) {
    console.error("Failed to fetch healthcare worker data");
  }
  const userData = await user.json();
  console.log(userData);

  //console.log(token);
  session.isLoggedIn = true;
  session.userId = token.sub;
  session.user = {
    id: userData.id,
    name: userData.name,
    phone: userData.phone,
    status: userData.status,
    role: token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    groups: ["test"],
  };

  console.log("Session: ", session);

  await saveSession(session);

  redirect("/dashboard/clients");
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
  const url = new URL(`${API_URL}/Measurements/${id}`);
  //url.searchParams.append("id", id);

  const response = await fetch(url.toString(), {
    cache: "no-cache",
  });
  if (!response.ok) {
    console.error("Failed to fetch client measurements");
    //throw new Error("Failed to fetch client measurements");
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

export {
  fetchClients,
  fetchClientDetails,
  fetchClientMeasurements,
  login,
  mockLogin,
  fetchVitalRanges,
};
