import { loginSchema } from "@/services/schemas";
import { z } from "zod";

const API_URL = process.env.API_URL;

const login = async (form: z.infer<typeof loginSchema>) => {
  const response = await fetch(`${API_URL}user/login`, {
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

const mockLogin = async (form: z.infer<typeof loginSchema>) => {
  const response = await fetch(`${API_URL}user/MockLogin`, {
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
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch client details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching client details: ", error);
  }
};

const fetchClientMeasurements = async (id: string) => {
  const url = new URL(`${API_URL}/Measurements/getById`);
  url.searchParams.append("id", id);

  const response = await fetch(url.toString(), {
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch client measurements");
  }
  return await response.json();
};

const fetchHealthcareWorkers = async () => {
  const response = await fetch(`${API_URL}/HealthcareWorkers`);
  if (!response.ok) {
    throw new Error("Failed to fetch healthcare workers");
  }
  return await response.json();
};

export {
  fetchClients,
  fetchClientDetails,
  fetchClientMeasurements,
  login,
  mockLogin,
  fetchHealthcareWorkers,
};
