const API_URL = 'http://localhost:3001/api'

export interface AuthResponse {
  token: string
  username: string
}

export const authApi = {
  signup: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка регистрации')
    }
    return response.json()
  },

  signin: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Ошибка входа')
    }
    return response.json()
  },
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
