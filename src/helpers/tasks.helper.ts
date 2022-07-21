import TaskModel from '../models/tasks.model'

const tasksHelper = {
  
    getTaskByIdOrExternalId: async (schemaName: string, Params: any) => {  
    const userDb = new TaskModel()
    if(Params.id ^ Params.external_id){
        throw Error('you need to use only id or external_id')
    }
    const searchField = Params.id? 'id': 'external_id'
    const id = Params[searchField]
    return userDb.getTask(schemaName, searchField, id)
    },
}
export default tasksHelper