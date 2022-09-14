import DbService from '../services/db.service'
import { COMPANIES_TABLES } from '../constants'

const notificationsHelper = {
    
    createNotification: async (schemaName: string, title: string, description: string, isOld:boolean ,updated: string, created: string): Promise<void> =>{
        const newNotification:any = {
            title:title,
            description:description||'',
            trigger: isOld ? updated : created
        }
        
        try{
            const db = new DbService()
            const notification = await db.insert(schemaName, COMPANIES_TABLES.NOTIFICATION, newNotification)
        }catch (error){
            console.error(error);
            throw error
        }
    }
}
export default notificationsHelper