import express from 'express'
import DbService from '../services/db.service'


const router = express.Router()
const healthCheck = async (req: express.Request, res:  express.Response) => {
    const db = new DbService()
    const DBStatus = await db.getOne('healthCheck') 
    return res.status(200).send({server:"alive", Database:DBStatus?.status})
}

// healthCheck
router.get('/healthCheck',healthCheck)
  

export default router
