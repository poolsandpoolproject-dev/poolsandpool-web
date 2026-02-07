export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type ApiEnvelope<T> = { data: T };

type ParsedPayload = unknown;

function getBaseUrl() {
  if (typeof window !== "undefined") return "/api/v1";
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.poolsandpool.co/api/v1";
}

function joinUrl(baseUrl: string, path: string) {
  const base = baseUrl.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function getAccessToken() {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

async function requestRaw(path: string, options: ApiRequestOptions = {}): Promise<ParsedPayload> {
  const { body, auth = false, headers, ...init } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  const hasBody = body !== undefined && body !== null;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (hasBody && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAccessToken();
    if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(joinUrl(getBaseUrl(), path), {
    ...init,
    headers: requestHeaders,
    body: hasBody ? (isFormData ? (body as BodyInit) : JSON.stringify(body)) : undefined,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload);
  }

  return payload;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const payload = await requestRaw(path, options);

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

export async function apiRequestRaw<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  return (await requestRaw(path, options)) as T;
}
