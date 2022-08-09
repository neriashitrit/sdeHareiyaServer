import IncidentModel from '../models/incidents.model'

const incidentsHelper = {
  
    getIncidentByIdOrExternalId: async (schemaName: string, Params: any) => {  
        const incidentModel = new IncidentModel()
        if(!(!!Params.id != !!Params.external_id)){ //logical xor on Params.id and Params.external_id
            throw Error('you need to use only id or external_id')
        }
        const searchField = Params.id? 'id' : 'external_id'
        const id = Params[searchField]
        return incidentModel.getIncident(schemaName, searchField, id)
    },

    getIncidentsSince: async (schemaName: string, sinceDaysAgo: string|number, untilDaysAgo:number) => {  
        const incidentModel = new IncidentModel()
        
        if ((typeof(sinceDaysAgo) !== 'number') && (sinceDaysAgo!='All') ){throw `send how many days ago incidents do you want? (int or 'ALL')`}
        if (typeof(untilDaysAgo) !== 'number'){throw 'send until how many days ago incidents do you want? (int)'}
        if (sinceDaysAgo=='All') {return incidentModel.getIncidentsSince(schemaName, 'created_at', new Date(0).toJSON(),  new Date().toJSON())    }

        const nowUtc = new Date()
        const sinceInEpoch = new Date().setDate(nowUtc.getDate()-sinceDaysAgo)
        const since = new Date(sinceInEpoch)
        const untilInEpoch = new Date().setDate(nowUtc.getDate()-untilDaysAgo)
        const until = new Date(untilInEpoch)
        return incidentModel.getIncidentsSince(schemaName, 'created_at', since.toJSON(), until.toJSON())
        },
}
export default incidentsHelper