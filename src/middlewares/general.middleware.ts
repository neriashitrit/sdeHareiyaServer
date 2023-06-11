import { NextFunction, Request, Response } from 'express'

export const generalMiddleware = (req: Request, _: Response, next: NextFunction) => {
  req.locals = {}
  next()
}
