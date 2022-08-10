import TaskModel from '../models/tasks.model'
import globalHelper from './global.helper'

const tasksHelper = {
  
    getTaskByIdOrExternalId: async (schemaName: string, Params: any) => {  
    const taskModel = new TaskModel()
    if(!(!!Params.id != !!Params.external_id)){ //logical xor on Params.id and Params.external_id
        throw Error('you need to use only id or external_id')
    }
    const searchField = Params.id? 'id': 'external_id'
    const id = Params[searchField]
    return taskModel.getTask(schemaName, searchField, id)
    },

    getTasksByDaysRange: async (schemaName: string, sinceDaysAgo: string|number, untilDaysAgo:number) => {  
        const taskModel = new TaskModel()
        if ((typeof(sinceDaysAgo) !== 'number') && (sinceDaysAgo!='All') ){throw `send how many days ago tasks do you want? (int or 'ALL')`}
        if (typeof(untilDaysAgo) !== 'number'){throw 'send until how many days ago tasks do you want? (int)'}
        if (sinceDaysAgo=='All') {return taskModel.getTasksByDaysRange(schemaName, 'created_at', new Date(0).toJSON(),  new Date().toJSON())}
        const [since, until] = globalHelper.getDaysRangeAsUtcDate(sinceDaysAgo, untilDaysAgo)
        return taskModel.getTasksByDaysRange(schemaName, 'created_at', since, until)
        },
} 
export default tasksHelper