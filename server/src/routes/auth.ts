import { Router } from 'express'
import { createToken } from '../auth'
import { usersRepo } from '../repositories/users'

export const authRouter = Router()

authRouter.post('/signup', (req, res) => {
  const { username, password } = req.body as {
    username?: string
    password?: string
  }

  if (!username || !password) {
    res.status(400).json({ error: 'Введите логин и пароль' })
    return
  }

  if (usersRepo.findByUsername(username)) {
    res.status(400).json({ error: 'Пользователь уже существует' })
    return
  }

  const userId = usersRepo.create(username, password)
  const token = createToken(userId)
  res.json({ token, username })
})

authRouter.post('/signin', (req, res) => {
  const { username, password } = req.body as {
    username?: string
    password?: string
  }

  const user = usersRepo.findByUsername(username ?? '')
  if (!user || !usersRepo.verifyPassword(user, password ?? '')) {
    res.status(401).json({ error: 'Неверный логин или пароль' })
    return
  }

  const token = createToken(user.id)
  res.json({ token, username })
})
