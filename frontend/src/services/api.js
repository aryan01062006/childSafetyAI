
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function submitConcern(data) {
  const response = await fetch(`${API_URL}/concerns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await parseJson(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit concern");
  }

  return result;
}

export async function getConcerns() {
   const response = await fetch(`${API_URL}/concerns`);
  const result = await parseJson(response);

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch concerns");
  }

  return result; 
}
