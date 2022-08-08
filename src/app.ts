import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './routes/routes'
import webAppRouter from './routes/webAppRoutes'
import openRouter from './routes/openRoutes'
import companiesRouter from './routes/trustnetRoutes'
import { adminSenderAuth, apiStrategy } from './middlewares/auth.middleware'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json()) // middleware to recognize JSON
app.use(express.urlencoded({ extended: false })) // recognize object as strings or arrays
app.use(logger('dev')) // logger middleware
app.use(cookieParser()) // parses incoming cookies from request to JSON

// app.use(passport.initialize())
// passport.use(bearerStrategy)

// Routes
app.use('/api/company', apiStrategy, userRouter)
app.use('/api/admin', adminSenderAuth, companiesRouter)
app.use('/api', openRouter)
app.use('/api/portal', webAppRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

export default app
