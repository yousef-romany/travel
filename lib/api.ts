export const api = async (path: string, options: RequestInit = {}, authToken?: string | null) => {
  const headers = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "API Error");
  return data;
};
