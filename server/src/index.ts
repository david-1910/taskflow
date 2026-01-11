import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// Тестовый маршрут
app.get('/api/tasks', (req, res) => {
  res.json([
    { id: 1, title: 'Изучить TypeScript', done: false },
    { id: 2, title: 'Сделать проект', done: false }
  ])
})

app.listen(3001, () => {
  console.log('Server: http://localhost:3001')
})