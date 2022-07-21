import IncidentModel from '../models/incidents.model'

const incidentsHelper = {
  
    getIncidentByIdOrExternalId: async (schemaName: string, Params: any) => {  
    const userDb = new IncidentModel()
    if(Params.id ^ Params.external_id){
        throw Error('you need to use only id or external_id')
    }
    const searchField = Params.id? 'id' : 'external_id'
    const id = Params[searchField]
    return userDb.getIncident(schemaName, searchField, id)
    },
}
export default incidentsHelper