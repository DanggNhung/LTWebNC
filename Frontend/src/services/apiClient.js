function getDefaultApiBaseUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:3000/api";
  }

  return `${window.location.protocol}//${window.location.hostname}:3000/api`;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultApiBaseUrl();

export async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Không thể tải dữ liệu từ API");
  }

  return payload?.data ?? payload;
}

export async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || "KhÃ´ng thá»ƒ ghi dá»¯ liá»‡u vá»›i API");
  }

  return payload?.data ?? payload;
}

export { API_BASE_URL };
