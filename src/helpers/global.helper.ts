import { TRUSTNET_SCHEMA } from "../constants"
import { AuthInfo } from "types"
import GlobalModel from '../models/global.model'

const globalModel = new GlobalModel()
const globalHelper = {

    getDaysRangeAsUtcDate: (sinceDaysAgo: number, untilDaysAgo:number):string[] => {  
        const nowUtc = new Date()
        const sinceInEpoch = new Date().setDate(nowUtc.getDate()-sinceDaysAgo)
        const since = new Date(sinceInEpoch)
        const untilInEpoch = new Date().setDate(nowUtc.getDate()-untilDaysAgo)
        const until = new Date(untilInEpoch)
        return [since.toJSON(), until.toJSON()]
        },
    
    getSchemaName: (authInfo: AuthInfo):string => {  
        return authInfo?.jobTitle.split(' ')[0]||''
        },
    
    getPosition: (authInfo: AuthInfo):string => {  
        return authInfo?.jobTitle.split(' ')[1]||''
        },

    createImage: async (imageType: string, imageCode: string, authInfo: AuthInfo, objectID:number, imageUrl: string):Promise<any> => {  
        const schemaName = imageType == 'insight'? globalHelper.getSchemaName(authInfo):TRUSTNET_SCHEMA
        try {
            const image = await globalModel.createImage(schemaName, 'image', imageCode, imageUrl)
            const updateObject = await globalModel.updateImageReference(schemaName, imageType, objectID, image.id)
            return {...updateObject, ...image}
        } catch (error) {
            console.error('ERROR in companies.controller createCompany()', error.message);
            return {message:'Something went wrong', error:error.message}
        }
    },
    
    getImage: async (imageType: string, authInfo: AuthInfo, objectID:number):Promise<any> => {  
        const schemaName = imageType == 'insight'? globalHelper.getSchemaName(authInfo):TRUSTNET_SCHEMA
        try {
            const imageWithUser = await globalModel.getImage(schemaName, imageType, objectID)
            return imageWithUser
        } catch (error) {
            console.error('ERROR in companies.controller createCompany()', error.message);
            return {message:'Something went wrong', error:error.message}
        }
    }
} 
export default globalHelper