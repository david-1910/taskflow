import { Router } from 'express'
import { authMiddleware } from '../auth'
import { tasksRepo, type TaskPatch } from '../repositories/tasks'
import type { AuthenticatedRequest } from '../types'

export const tasksRouter = Router()

tasksRouter.use(authMiddleware)

/** Safe to call on routes mounted behind `authMiddleware` */
const userIdOf = (req: AuthenticatedRequest): number => req.userId ?? 0

tasksRouter.get('/', (req, res) => {
  res.json(tasksRepo.listByUser(userIdOf(req)))
})

tasksRouter.post('/', (req, res) => {
  const { title, deadline, priority, category } = req.body
  const task = tasksRepo.create(userIdOf(req), {
    title,
    deadline,
    priority,
    category,
  })
  res.json(task)
})

tasksRouter.patch('/:id', (req, res) => {
  const userId = userIdOf(req)
  const id = Number(req.params.id)
  const patch = req.body as TaskPatch

  // Проверяем что задача принадлежит пользователю
  if (!tasksRepo.exists(id, userId)) {
    res.status(404).json({ error: 'Задача не найдена' })
    return
  }

  tasksRepo.update(id, patch)
  res.json({ success: true })
})

tasksRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  tasksRepo.delete(id, userIdOf(req))
  res.json({ success: true })
})
