import { request, tokenStorage, usernameStorage } from './client'

export { tokenStorage, usernameStorage }

export interface AuthResponse {
  token: string
  username: string
}

export const authApi = {
  signup: (username: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      fallbackError: 'Ошибка регистрации',
    }),

  signin: (username: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('/signin', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      fallbackError: 'Ошибка входа',
    }),
}
