import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Request, Response, NextFunction } from 'express'

const SECRET = 'aX9$kL2@mN4#pQ7&vR0!wS3*yU6^zT8'
//- Хеширование пароля
export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10)
}
//- Проверка пароля
export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash)
}

// -Создание токена
export const createToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '1d' })
}

// -Middleware для проверки токена
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' })
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: number }
    ;(req as any).userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ error: 'Неверный токен' })
  }
}
