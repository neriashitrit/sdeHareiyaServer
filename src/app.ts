import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'

import openRouter from './routes/openRoutes'
import cronRouter from './routes/cronRoutes'
import webAppRouter from './routes/webAppRoutes'

dotenv.config()
const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json()) // middleware to recognize JSON
app.use(express.urlencoded({ extended: false })) // recognize object as strings or arrays

// Routes
app.use( '/api/webapp',  webAppRouter)
app.use('/api/openRouter', openRouter)
app.use('/api/cronJobs', cronRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running in ${process.env.NODE_ENV} mode on port: ${port}`)
})

export default app
