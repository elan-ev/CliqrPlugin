import Backbone from 'backbone'
import _ from 'underscore'
import { showConfirmDialog } from '../dialog'

import Viewmaster from './viewmaster'

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

const TasksShowView = Viewmaster.extend({

    tagName: 'article',

    className: 'cliqr--tasks-show',

    events: {
        'click .js-start': 'onClickStart',
        'click .js-stop': 'onClickStop',
        'click .js-copy-edit': 'onClickCopyEdit'
    },

    taskType: null,

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        taskTypes.fetchTaskType(this.model)
            .then(taskType => {
                this.taskType = taskType

                const view = this.taskType.getShowView()
                this.setView('main', view)
                this.refreshViews()

                view && _.invoke([view], 'postRender')

                return null
            })
    },

    template: require('../../hbs/tasks-show.hbs'),

    context() {
        return { ...decorateTask(this.model) }
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
        running.stop()
            .then((r) => {
                this.render()
                return null
            })
    },

    onClickCopyEdit(event) {
        showConfirmDialog(
            "Diese Frage kann nicht mehr geändert werden, da sie schon beantwortet wurde.\nWollen Sie eine Kopie dieser Frage erstellen und bearbeiten?",
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
