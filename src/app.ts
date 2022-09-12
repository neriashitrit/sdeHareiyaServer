import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import fileupload from 'express-fileupload';

import userRouter from './routes/routes'
import webAppRouter from './routes/webAppRoutes'
import openRouter from './routes/openRoutes'
import companiesRouter from './routes/trustnetRoutes'
import { adminSenderAuth, apiStrategy, bearerStrategy } from './middlewares/auth.middleware'

dotenv.config()
const app = express()

app.use(cors())
app.use(fileupload())
app.use(express.json()) // middleware to recognize JSON
app.use(express.urlencoded({ extended: false })) // recognize object as strings or arrays
app.use(logger('dev')) // logger middleware

app.use(passport.initialize())
passport.use(bearerStrategy)

// Routes
app.use('/api/company', apiStrategy, userRouter)
app.use('/api/admin', adminSenderAuth, companiesRouter)
app.use('/api/portal', passport.authenticate(bearerStrategy, { session: false }), webAppRouter)
app.use('/api', openRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running in ${process.env.NODE_ENV} mode on port: ${port}`)
})

export default app
