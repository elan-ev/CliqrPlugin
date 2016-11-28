import Backbone from 'backbone'
import _ from 'underscore'
import { showLoading, hideLoading } from '../utils'
import Viewmaster from './viewmaster'
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

const TasksEditView = Viewmaster.extend({

    tagName: 'article',

    className: 'cliqr--tasks-edit',

    taskType: null,

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        taskTypes.fetchTaskType(this.model)
            .then(taskType => {
                this.taskType = taskType
                this.listenTo(this.taskType, 'editTask', this.onEditTask)

                const view = this.taskType.getEditView()
                this.setView('main', view)
                this.refreshViews()

                view && _.invoke([view], 'postRender')

                return null
            })
    },

    template: require('../../hbs/tasks-edit.hbs'),

    context() {
        return decorateTask(this.model)
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
                console.log('TODO catch', response)
                return null
            })
    },

    onClickStop(event) {
        event.preventDefault()

        const running = this.model.getVotings().find(a => a.isRunning())
        running.save({ end: new Date().toISOString() })
            .then((r) => {
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
                console.log('caught an error while editing task', this.model)
                hideLoading()
                return null
            })
    }
})

export default TasksEditView
