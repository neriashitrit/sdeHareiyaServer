import InsightModel from '../models/insights.model'
import globalHelper from './global.helper'

const insightsHelper = {
  
    getInsightsByDaysRange: async (schemaName: string, sinceDaysAgo: string|number, untilDaysAgo:number) => {  
        const insightModel = new InsightModel()
        if ((typeof(sinceDaysAgo) !== 'number') && (sinceDaysAgo!='All') ){throw `send how many days ago insights do you want? (int or 'ALL')`}
        if (typeof(untilDaysAgo) !== 'number'){throw 'send until how many days ago insights do you want? (int)'}
        if (sinceDaysAgo=='All') {return insightModel.getInsightsByDaysRange(schemaName, 'created_at', new Date(0).toJSON(),  new Date().toJSON())}
        const [since, until] = globalHelper.getDaysRangeAsUtcDate(sinceDaysAgo, untilDaysAgo)
        return insightModel.getInsightsByDaysRange(schemaName, 'created_at', since, until)
        },

}
export default insightsHelper