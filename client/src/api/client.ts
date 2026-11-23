const API_BASE_URL = 'http://localhost:3001/api'

export interface ApiErrorBody {
  error?: string
}

/**
 * Thin fetch wrapper: sends JSON, parses errors and throws a descriptive
 * Error with the given fallback message when the response is not ok.
 */
export async function request<T>(
  path: string,
  options: RequestInit & { fallbackError?: string } = {}
): Promise<T> {
  const { fallbackError = 'Ошибка запроса', headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(tokenStorage.get()
        ? { Authorization: `Bearer ${tokenStorage.get()}` }
        : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    let message = fallbackError
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body.error) message = body.error
    } catch {
      // тело без сообщения об ошибке — используем fallback
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

// Работа с токеном
export const tokenStorage = {
  get: () => localStorage.getItem('token'),
  set: (token: string) => localStorage.setItem('token', token),
  remove: () => localStorage.removeItem('token'),
}

export const usernameStorage = {
  get: () => localStorage.getItem('username'),
  set: (username: string) => localStorage.setItem('username', username),
  remove: () => localStorage.removeItem('username'),
}
