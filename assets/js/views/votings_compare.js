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
        this.listenTo(this.votings, 'change sync', this.render)

        const selectors = ['section.cliqr--voting-side-a main', 'section.cliqr--voting-side-b main']

        this.listenTo(this.votings, 'sync', (voting) => {
            const view = getView(voting)
            this.setView(selectors[this.votings.indexOf(voting)], view)
            this.refreshViews()
            view.postRender && view.postRender()
        })
    },

    template: require('../../hbs/votings-compare.hbs'),

    context() {
        const votingA = this.votings.first(),
              votingB = this.votings.last(),
              task = votingA && votingA.getTask()
        return {
            votingA: votingA.toJSON(),
            votingB: votingB.toJSON(),
            task: task && task.toJSON()
        }
    }
})

export default VotingsCompareView
