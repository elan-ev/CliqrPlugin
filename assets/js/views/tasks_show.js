import Backbone from 'backbone'
import _ from 'underscore'
import utils from '../utils'

import taskTypes from '../models/task_types'
import Voting from '../models/voting'

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
        'click .js-start': 'onClickStart'
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
        this.$el.html(template({ ...decorateTask(this.model) }))
        this.renderTaskTypeView()
        return this
    },

    renderTaskTypeView() {
        const taskTypeView = this.taskType.getAuthorView()
        this.$('main').append(taskTypeView.render().$el)
    },

    onClickStart(event) {
        event.preventDefault()
        const vtng = new Voting({ task_id: this.model.id })
        vtng.save()
            .then((model) => {
                const id = model.id
                Backbone.history.navigate(`voting-${id}`, { trigger: true })
            })
            .catch((response) => console.log("TODO catch", response))
    }
})

export default TasksShowView
