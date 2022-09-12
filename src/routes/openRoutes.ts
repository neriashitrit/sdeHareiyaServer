import express from 'express'
import  FileService  from '../services/storage.service'

const fileService = FileService.getInstance()

const router = express.Router()
const healthCheck = async (req: express.Request, res:  express.Response) => {
    fileService.insert('','fileTry','directoryTry')

    return res.status(200).send("I am alive!!!")
}

// healthCheck
router.get('/healthCheck',healthCheck)
  

export default router
