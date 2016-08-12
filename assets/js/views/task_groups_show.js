import Backbone from 'backbone'
import _ from 'underscore'
import Task from '../models/task'

const decorateTaskGroup = function (model) {
    return {
        ...model.toJSON(),
        tasks: _.map(model.get('tasks'), (t) => {
            const task = new Task(t),
                  assignments = task.getAssignments()

            return {
                ...t,
                assignments_count: assignments.length,
                last_assignment: assignments.last().toJSON(),
                state: task.getCurrentState()
            }
        })
    }
}

const TaskGroupsShowView = Backbone.View.extend({

    className: 'page task-groups-show',

    events: {
    },

    initialize() {
        //this.interval = setInterval( () => this.model.fetch(), 2000)
    },

    remove() {
        //clearInterval(this.interval)
        Backbone.View.prototype.remove.call(this)
    },

    render() {
        const template = require('../../hbs/task-groups-show.hbs')
        this.$el.html(template(decorateTaskGroup(this.model)))
        return this
    }
})

export default TaskGroupsShowView
