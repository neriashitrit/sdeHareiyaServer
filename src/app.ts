import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import fileupload from 'express-fileupload';
import helmet from 'helmet'
import emailService from './services/email.service'

import backOfficeRouter from './routes/backOfficeRoutes'
import webAppRouter from './routes/webAppRoutes'
import openRouter from './routes/openRoutes'
import { adminSenderAuth, bearerStrategy } from './middlewares/auth.middleware'
import { roleGuard } from './middlewares/roleGuard.middleware'

dotenv.config()
const app = express()

emailService.start(process.env.SENDGRID_API_KEY || '')
app.use(helmet())
app.use(cors())
app.use(fileupload())
app.use(express.json()) // middleware to recognize JSON
app.use(express.urlencoded({ extended: false })) // recognize object as strings or arrays
app.use(logger('dev')) // logger middleware

app.use(passport.initialize())
passport.use(bearerStrategy)

// Routes
app.use('/api/backOffice', adminSenderAuth, backOfficeRouter)
app.use('/api/webapp', passport.authenticate(bearerStrategy, { session: false }), roleGuard(), webAppRouter)
app.use('/api/flutterapp', passport.authenticate(bearerStrategy, { session: false }), roleGuard(), webAppRouter)
app.use('/api', openRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running in ${process.env.NODE_ENV} mode on port: ${port}`)
})

export default app
