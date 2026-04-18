const BASE = `${(import.meta.env.VITE_API_URL as string | undefined)?.trim() || "https://portfolio-backend-anshudevil07s-projects.vercel.app/api"}/admin`;

export const getToken = () => localStorage.getItem("admin_token") || "";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const login = async (username: string, password: string) => {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

export const getStats = async () => {
  const res = await fetch(`${BASE}/stats`, { headers: headers() });
  return res.json();
};

export const getPortfolios = async (params: Record<string, string>) => {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/portfolios?${qs}`, { headers: headers() });
  return res.json();
};

export const getPortfolio = async (id: string) => {
  const res = await fetch(`${BASE}/portfolios/${id}`, { headers: headers() });
  return res.json();
};

export const updateStatus = async (id: string, status: string) => {
  const res = await fetch(`${BASE}/portfolios/${id}/status`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const deletePortfolio = async (id: string) => {
  const res = await fetch(`${BASE}/portfolios/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  return res.json();
};

export const getPortfolioAnalytics = async (id: string) => {
  const res = await fetch(`${BASE}/portfolios/${id}/analytics`, { headers: headers() });
  return res.json();
};
