import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { NextFunction, Request, Response } from 'express'
import { config } from './config'
import type { AuthenticatedRequest } from './types'

const SALT_ROUNDS = 10

/** Hash a plain-text password */
export const hashPassword = (password: string): string =>
  bcrypt.hashSync(password, SALT_ROUNDS)

/** Compare a plain-text password against a stored hash */
export const comparePassword = (password: string, hash: string): boolean =>
  bcrypt.compareSync(password, hash)

/** Create a signed JWT for the given user id */
export const createToken = (userId: number): string =>
  jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.tokenExpiresIn })

/** Extract and verify the Bearer token, attaching `userId` to the request */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Токен не предоставлен' })
    return
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number }
    ;(req as AuthenticatedRequest).userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ error: 'Неверный токен' })
  }
}

/** Type-guard helper for handlers mounted behind `authMiddleware` */
export const asAuthed = (req: Request): AuthenticatedRequest =>
  req as AuthenticatedRequest
