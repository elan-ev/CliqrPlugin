import Backbone from 'backbone'
import _ from 'underscore'
import utils from '../utils'

import taskTypes from '../models/task_types'

const decorateTask = function (task) {
    return {
        ...task.toJSON(),
        assignments: task.getAssignments().map(function (a) {
            return {
                ...a.toJSON(),
                running: a.isBetween()
            }
        })
    }
}

const TasksShowView = Backbone.View.extend({

    className: 'page tasks-show',

    events: {
    },

    taskType: null,

    initialize() {
        //this.interval = setInterval( () => this.model.fetch(), 2000)

        this.taskType = taskTypes.getTaskType(this.model)
    },

    remove() {
        //clearInterval(this.interval)
        Backbone.View.prototype.remove.call(this)
    },

    render() {
        const template = require('../../hbs/tasks-show.hbs')
        const taskTypeView = this.taskType.renderAuthor()
        this.$el.html(template({ ...decorateTask(this.model), taskTypeView }))
        return this
    }
})

export default TasksShowView
