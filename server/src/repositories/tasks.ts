import db from '../db'
import type { Priority, TaskDto, TaskRow } from '../types'

const toDto = (task: TaskRow): TaskDto => ({
  id: task.id,
  title: task.title,
  done: task.done === 1,
  deadline: task.deadline,
  priority: task.priority,
  category: task.category,
})

export interface NewTask {
  title: string
  deadline?: string | null
  priority?: Priority
  category?: string | null
}

export type TaskPatch = Partial<NewTask> & { done?: boolean }

export const tasksRepo = {
  listByUser(userId: number): TaskDto[] {
    const rows = db
      .prepare<[number], TaskRow>('SELECT * FROM tasks WHERE user_id = ?')
      .all(userId)
    return rows.map(toDto)
  },

  create(userId: number, data: NewTask): TaskDto {
    const task = {
      title: data.title,
      deadline: data.deadline ?? null,
      priority: data.priority ?? ('medium' as Priority),
      category: data.category ?? null,
      done: false,
    }

    const result = db
      .prepare(
        'INSERT INTO tasks (title, deadline, priority, category, user_id) VALUES (?, ?, ?, ?, ?)'
      )
      .run(task.title, task.deadline, task.priority, task.category, userId)

    return { id: Number(result.lastInsertRowid), ...task }
  },

  exists(id: number, userId: number): boolean {
    return Boolean(
      db
        .prepare('SELECT 1 FROM tasks WHERE id = ? AND user_id = ?')
        .get(id, userId)
    )
  },

  update(id: number, patch: TaskPatch): void {
    // Собираем UPDATE только из переданных полей
    const columns: string[] = []
    const values: unknown[] = []

    const set = (column: string, value: unknown) => {
      columns.push(`${column} = ?`)
      values.push(value)
    }

    if (patch.title !== undefined) set('title', patch.title)
    if (patch.done !== undefined) set('done', patch.done ? 1 : 0)
    if (patch.deadline !== undefined) set('deadline', patch.deadline)
    if (patch.priority !== undefined) set('priority', patch.priority)
    if (patch.category !== undefined) set('category', patch.category)

    if (columns.length === 0) return

    db.prepare(`UPDATE tasks SET ${columns.join(', ')} WHERE id = ?`).run(
      ...values,
      id
    )
  },

  delete(id: number, userId: number): void {
    db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(
      id,
      userId
    )
  },
}
