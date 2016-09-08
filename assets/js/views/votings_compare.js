import Backbone from 'backbone'
import _ from 'underscore'

import taskTypes from '../models/task_types'
import Votings from '../models/votings'

import Viewmaster from './viewmaster'


const getView = function (model) {
    const taskType = taskTypes.getTaskType(model.getTask())
    return taskType.getAssignmentView(model)
}

const VotingsCompareView = Viewmaster.extend({

    tagName: 'article',

    className: 'cliqr--votings-compare',

    events: {
    },

    initialize({ votings }) {
        Viewmaster.prototype.initialize.call(this)

        this.votings = new Votings(votings)
        this.listenTo(this.votings, 'all', this.render)

        const selectors = ['section.cliqr--voting-side-a main', 'section.cliqr--voting-side-b main']

        this.listenTo(this.votings, 'sync', (voting) => {
            this.setView(selectors[this.votings.indexOf(voting)], getView(voting))
        })
    },

    template: require('../../hbs/votings-compare.hbs'),

    context() {
        return {
            votingA: this.votings.first().toJSON(),
            votingB: this.votings.last().toJSON()
        }
    }
})

export default VotingsCompareView
