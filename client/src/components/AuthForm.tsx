import { useState } from 'react'
import { authApi, tokenStorage, usernameStorage } from '../api/auth'
import { FiUser, FiLock, FiLogIn, FiUserPlus } from 'react-icons/fi'

interface AuthFormProps {
  onSuccess: () => void
}

export const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = isLogin
        ? await authApi.signin(username, password)
        : await authApi.signup(username, password)

      tokenStorage.set(response.token)
      usernameStorage.set(response.username)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600">
      {/* Декоративные круги */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-slate-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-slate-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

      {/* Форма */}
      <div className="relative backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-500/30 rounded-full mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-white">TaskFlow</h1>
          <p className="text-white/70 mt-2">
            {isLogin ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Поле логина */}
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-xl" />
            <input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              required
            />
          </div>

          {/* Поле пароля */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-xl" />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              required
            />
          </div>

          {/* Ошибка */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-slate-600 font-semibold rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <FiLogIn className="text-xl" /> : <FiUserPlus className="text-xl" />}
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </>
            )}
          </button>
        </form>

        {/* Переключатель */}
        <div className="text-center mt-6">
          <span className="text-white/70">
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white font-semibold ml-2 hover:underline cursor-pointer"
          >
            {isLogin ? 'Регистрация' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  )
}
