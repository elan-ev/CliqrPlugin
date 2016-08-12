import Backbone from 'backbone'
import _ from 'underscore'

import Task from '../models/task'
import taskTypes from '../models/task_types'

const decorateVoting = function (voting) {
    return {
        ...voting,
        isRunning: voting.isRunning()
    }
}

const VotingsShowView = Backbone.View.extend({

    className: 'page votings-show',

    events: {
    },

    taskType: null,

    initialize() {
        //this.interval = setInterval( () => this.model.fetch(), 2000)

        const task = this.model.getTask()
        this.taskType = taskTypes.getTaskType(task)
    },

    remove() {
        //clearInterval(this.interval)
        Backbone.View.prototype.remove.call(this)
    },

    render() {
        const template = require('../../hbs/votings-show.hbs')
        this.$el.html(template({
            ...decorateVoting(this.model),
            taskTypeView: this.taskType.renderVoting(this.model)
        }))
        return this
    }
})

export default VotingsShowView
