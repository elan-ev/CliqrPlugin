import Backbone from 'backbone'
import _ from 'underscore'
import { showConfirmDialog } from '../dialog'

import taskTypes from '../models/task_types'
import Voting from '../models/voting'

const decorateTask = function (task) {
    const votings = task.getVotings()
    return {
        ...task.toJSON(),
        state: task.getCurrentState(),
        editable: !votings.any((v) => v.get('responses_count')),
        votings: votings.map(function (v) {
            return {
                ...v.toJSON(),
                running: v.isRunning()
            }
        })
    }
}

const TasksShowView = Backbone.View.extend({

    tagName: 'article',

    className: 'cliqr--tasks-show',

    events: {
        'click .js-start': 'onClickStart',
        'click .js-stop': 'onClickStop',
        'click .js-copy-edit': 'onClickCopyEdit'
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
        const taskTypeView = this.taskType.getShowView()
        this.$('main').append(taskTypeView.render().$el)
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
        running.stop()
            .then((r) => {
                console.log("saved")
                this.render()
                return null
            })
    },

    onClickCopyEdit(event) {
        showConfirmDialog(
            `<p>Diese Frage kann nicht mehr geändert werden, da sie schon beantwortet wurde.</p>
             <p>Wollen Sie eine Kopie dieser Frage erstellen und bearbeiten?</p>`,
            () => {
                this.model.duplicate()
                    .then((task) => {
                        Backbone.history.navigate(`task/edit/${task.id}`, { trigger: true })
                        return null
                    })
            }
        )
    }
})

export default TasksShowView
