import { AuthInfo } from "types"

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

} 
export default globalHelper