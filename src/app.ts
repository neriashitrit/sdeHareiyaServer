import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import dotenv from 'dotenv'
import passport from 'passport'
import cors from 'cors'
// import path from 'path'

import userRouter from './routes/routes'
import { apiSenderAuth, bearerStrategy } from './middlewares/auth.middleware'

dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json()) // middleware to recognize JSON
app.use(express.urlencoded({ extended: false })) // recognize object as strings or arrays
app.use(logger('dev')) // logger middleware
app.use(cookieParser()) // parses incoming cookies from request to JSON

app.use(passport.initialize())
// passport.use(bearerStrategy)

// Routes
app.use('/api',apiSenderAuth, userRouter)
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})

export default app
