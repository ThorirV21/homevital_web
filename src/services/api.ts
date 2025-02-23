const API_URL = process.env.API_URL;

const fetchClients = async () => {
  const response = await fetch(`${API_URL}/patients`, {
    cache: "force-cache",
  });
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

// How can I add query parameters to this function?

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

export { fetchClients, fetchClientDetails, fetchClientMeasurements };
