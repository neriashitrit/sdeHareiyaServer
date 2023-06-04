import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fileupload from 'express-fileupload'
import helmet from 'helmet'
import logger from 'morgan'
import passport from 'passport'

import { adminSenderAuth, bearerStrategy } from './middlewares/auth.middleware'
import { roleGuard } from './middlewares/roleGuard.middleware'
import adminRouter from './routes/adminWebAppRoutes'
import backOfficeRouter from './routes/backOfficeRoutes'
import openRouter from './routes/openRoutes'
import webAppRouter from './routes/webAppRoutes'

dotenv.config()
const app = express()

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
app.use('/api/webapp', passport.authenticate('oauth-bearer', { session: false }), roleGuard(), webAppRouter)
app.use('/api/admin', passport.authenticate('oauth-bearer', { session: false }), roleGuard(), adminRouter)
app.use('/api/flutterapp', passport.authenticate('oauth-bearer', { session: false }), roleGuard(), webAppRouter)
app.use('/api/openRouter', openRouter)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running in ${process.env.NODE_ENV} mode on port: ${port}`)
})

export default app
