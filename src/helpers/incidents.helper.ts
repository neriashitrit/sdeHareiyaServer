import IncidentModel from '../models/incidents.model'
import globalHelper from './global.helper'

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

    getIncidentsByDaysRange: async (schemaName: string, sinceDaysAgo: string|number, untilDaysAgo:number) => {  
        const incidentModel = new IncidentModel()
        if ((typeof(sinceDaysAgo) !== 'number') && (sinceDaysAgo!='All') ){throw `send how many days ago incidents do you want? (int or 'ALL')`}
        if (typeof(untilDaysAgo) !== 'number'){throw 'send until how many days ago incidents do you want? (int)'}
        if (sinceDaysAgo=='All') {return incidentModel.getIncidentsByDaysRange(schemaName, 'created_at', new Date(0).toJSON(),  new Date().toJSON())}
        const[since, until] = globalHelper.getDaysRangeAsUtcDate(sinceDaysAgo, untilDaysAgo)
        return incidentModel.getIncidentsByDaysRange(schemaName, 'created_at', since, until)
        },
}
export default incidentsHelper