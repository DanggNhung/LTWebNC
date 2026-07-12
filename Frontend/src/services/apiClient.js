function getDefaultApiBaseUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:3000/api";
  }

  return `${window.location.protocol}//${window.location.hostname}:3000/api`;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultApiBaseUrl();
const DEMO_SESSION_STORAGE_KEY = "student-management-demo-session-id";

function createSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDemoSessionId() {
  if (typeof window === "undefined") return "";

  let sessionId = window.sessionStorage.getItem(DEMO_SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = createSessionId();
    window.sessionStorage.setItem(DEMO_SESSION_STORAGE_KEY, sessionId);
  }

  return sessionId;
}

export function resetDemoSessionId() {
  if (typeof window === "undefined") return "";
  const sessionId = createSessionId();
  window.sessionStorage.setItem(DEMO_SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

export function clearDemoSessionId() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
}

function buildHeaders(headers = {}) {
  return {
    "X-Demo-Session-Id": getDemoSessionId(),
    ...headers
  };
}

export async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: buildHeaders({
      Accept: "application/json"
    })
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
    headers: buildHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {})
    }),
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Không thể ghi dữ liệu với API");
  }

  return payload?.data ?? payload;
}

export { API_BASE_URL };
