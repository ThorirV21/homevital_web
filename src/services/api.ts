const API_URL = "https://homevital-api-dev.azurewebsites.net/api";

const fetchClients = async () => {
  const response = await fetch(`${API_URL}/patients`);
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }
  return await response.json();
};

const fetchClientDetails = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/patients/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch client details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching client details: ", error);
  }
};

export { fetchClients, fetchClientDetails };
