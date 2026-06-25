const API_BASE = '/api'
const TOKEN_KEY = 'mybudgets:token'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly fieldErrors?: Record<string, string> | null,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type Params = Record<string, string | number | boolean | undefined> | object

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  params?: Params
  public?: boolean
}

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => { localStorage.setItem(TOKEN_KEY, token) },
  remove: (): void => { localStorage.removeItem(TOKEN_KEY) },
}

function buildUrl(path: string, params?: Params): string {
  const url = new URL(`${API_BASE}${path}`, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, public: isPublic = false } = options

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (!isPublic) {
    const token = tokenStorage.get()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401 || response.status === 403) {
    tokenStorage.remove()
    window.location.href = '/login'
    throw new ApiError(response.status, 'Sessão expirada. Faça login novamente.')
  }

  if (response.status === 204) return undefined as T

  let data: unknown
  const contentType = response.headers.get('content-type') ?? ''

  // Trata application/json e variações como application/hal+json (Spring HATEOAS)
  if (contentType.includes('json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const err = data as {
      message?: string
      fieldErrors?: Record<string, string> | null
    }
    throw new ApiError(
      response.status,
      err.message ?? `Erro ${response.status}`,
      err.fieldErrors,
    )
  }

  return data as T
}

export const http = {
  get: <T>(path: string, params?: Params, opts?: Pick<RequestOptions, 'public'>) =>
    request<T>(path, { method: 'GET', params, ...opts }),
  post: <T>(path: string, body?: unknown, opts?: Pick<RequestOptions, 'public'>) =>
    request<T>(path, { method: 'POST', body, ...opts }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
  delete: <T = void>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
}