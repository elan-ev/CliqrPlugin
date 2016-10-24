import Backbone from 'backbone'
import _ from 'underscore'
import { showLoading, hideLoading } from '../utils'

import taskTypes from '../models/task_types'
import Voting from '../models/voting'

const decorateTask = function (task) {
    return {
        ...task.toJSON(),
        state: task.getCurrentState(),
        votings: task.getVotings().map(function (v) {
            return {
                ...v.toJSON(),
                running: v.isRunning()
            }
        })
    }
}

const TasksEditView = Backbone.View.extend({

    tagName: 'article',

    className: 'cliqr--tasks-edit',

    events: {
    },

    taskType: null,

    initialize() {
        //this.interval = setInterval( () => this.model.fetch(), 2000)

        this.taskType = taskTypes.getTaskType(this.model)

        this.listenTo(this.taskType, 'editTask', this.onEditTask);
    },

    remove() {
        //clearInterval(this.interval)
        Backbone.View.prototype.remove.call(this)
    },

    render() {
        const template = require('../../hbs/tasks-edit.hbs')
        this.$el.html(template({ ...decorateTask(this.model) }))
        this.renderTaskTypeView()
        return this
    },

    renderTaskTypeView() {
        const taskTypeView = this.taskType.getEditView()
        this.$('main').append(taskTypeView.render().$el)
        taskTypeView.postRender && taskTypeView.postRender()
    },

    onClickStart(event) {
        event.preventDefault()
        const vtng = new Voting({ task_id: this.model.id })
        vtng.save()
            .then((model) => {
                const id = model.id
                Backbone.history.navigate(`voting/${id}`, { trigger: true })
                return null
            })
            .catch((response) => {
                console.log("TODO catch", response)
                return null
            })
    },

    onClickStop(event) {
        event.preventDefault()

        const running = this.model.getVotings().find(a => a.isRunning())
        running.save({ end: new Date().toISOString() })
            .then((r) => {
                console.log("saved")
                this.render()
                return null
            })
    },

    onEditTask(model) {
        this.model.set(model.attributes, { silent: true })

        showLoading()

        this.model.save()
            .then((response) => {
                Backbone.history.navigate(`task/show/${this.model.id}`, { trigger: true })
                hideLoading()
                return null
            })
            .catch((error) => {
                console.log("caught an error while editing task", this.model)
                hideLoading()
                return null
            })
    }
})

export default TasksEditView
