import { loginSchema } from "@/services/schemas";
import { z } from "zod";
import { parseJwt } from "@/lib/utils";
import { getSession, logout, saveSession } from "@/services/session";

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
  if (response.status === 401) {
    logout();
    return null;
  }
  if (!response.ok) {
    return null;
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
    ssn: form.kennitala,
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
    return null;
  }
  return await response.json();
};

export { login, mockLogin };
