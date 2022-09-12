import express from 'express'


const router = express.Router()
const healthCheck = async (req: express.Request, res:  express.Response) => {
    return res.status(200).send("I am alive!!!")
}

// healthCheck
router.get('/healthCheck',healthCheck)
  

export default router
