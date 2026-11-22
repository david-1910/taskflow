const DEFAULT_SECRET = 'aX9$kL2@mN4#pQ7&vR0!wS3*yU6^zT8'

export const config = {
  port: Number(process.env.PORT ?? 3001),
  // Prefer providing JWT_SECRET via environment; fall back to the dev default.
  jwtSecret: process.env.JWT_SECRET ?? DEFAULT_SECRET,
  tokenExpiresIn: 60 * 60 * 24, // seconds (1 day)
  dbFile: process.env.DB_FILE ?? 'tasks.db',
}
