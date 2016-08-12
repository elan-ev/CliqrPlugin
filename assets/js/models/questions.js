import Backbone from 'backbone'
import _ from 'underscore'

import Question from './question'

const QuestionCollection = Backbone.Collection.extend({

    model: Question,

    url() {
        return cliqr.config.PLUGIN_URL + 'questions/index?cid=' + cliqr.config.CID
    },

    comparator(question) {
        return question.get('startdate')
    },

    groupByDate() {
        return this.groupBy((model) => {
            const start = model.get('startdate')
            if (start === 0) {
                return null
            }

            return 86400 * Math.floor(start / 86400)
        })
    }
})

export default QuestionCollection
