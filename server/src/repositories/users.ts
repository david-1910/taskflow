import db from '../db'
import { hashPassword, comparePassword } from '../auth'
import type { UserRow } from '../types'

export const usersRepo = {
  findByUsername(username: string): UserRow | undefined {
    return db
      .prepare<[string], UserRow>('SELECT * FROM users WHERE username = ?')
      .get(username)
  },

  create(username: string, password: string): number {
    const result = db
      .prepare('INSERT INTO users (username, password) VALUES (?, ?)')
      .run(username, hashPassword(password))
    return Number(result.lastInsertRowid)
  },

  verifyPassword(user: UserRow, password: string): boolean {
    return comparePassword(password, user.password)
  },
}
