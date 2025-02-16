const API_URL = "http://localhost:3000";

const fetchClients = async () => {
  const response = await fetch(`${API_URL}/clients`);
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }
  return response.json();
};

const fetchClientDetails = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/clients/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch client details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching client details: ", error);
  }
};

export { fetchClients, fetchClientDetails };
