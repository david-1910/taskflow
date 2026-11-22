import express from 'express'
import cors from 'cors'
import { config } from './config'
import { authRouter } from './routes/auth'
import { tasksRouter } from './routes/tasks'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', authRouter)
app.use('/api/tasks', tasksRouter)

app.listen(config.port, () => {
  console.log(`Server: http://localhost:${config.port}`)
})
