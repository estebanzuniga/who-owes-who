// frontend/src/api/fetchClient.ts
const API_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
  method: string;
  body?: any;
}

export default async function api(endpoint: string, options: FetchOptions = { method: 'GET' }) {
  const { method, body, ...rest } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || res.statusText);
  }

  return res.json();
}
