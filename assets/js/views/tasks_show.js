import Backbone from 'backbone'
import _ from 'underscore'
import { showConfirmDialog } from '../dialog'
import showError from '../error'

import Viewmaster from './viewmaster'

import taskTypes from '../models/task_types'
import Voting from '../models/voting'

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
            .catch(error => {
                showError('Could not fetch type of task', error)
            })
    },

    template: require('../../hbs/tasks-show.hbs'),

    context() {
        const votings = this.model.getVotings()
        const task = this.model.toJSON()
        return {
            task,
            state: this.model.getCurrentState(),
            editable: !votings.any((v) => v.get('responses_count')),
            votings: votings.map(function (v) {
                return {
                    ...v.toJSON(),
                    running: v.isRunning()
                }
            }).reverse(),
            breadcrumb: {
                task_group_id: task.task_group_id,
                task_group_title: task.task_group_title
            }
        }
    },

    onClickStart(event) {
        event.preventDefault()
        const vtng = new Voting({ task_id: this.model.id })
        vtng.save()
            .then(model => {
                Backbone.history.navigate(`voting/${model.id}`, { trigger: true })
                return null
            })
            .catch(response => {
                showError('Could not start voting', response)
            })
    },

    onClickStop(event) {
        event.preventDefault()

        const running = this.model.getVotings().find(a => a.isRunning())
        running.stop()
            .then(() => {
                this.render()
                return null
            })
            .catch(response => {
                showError('Could not stop voting', response)
            })
    },

    onClickCopyEdit() {
        showConfirmDialog(
            "Diese Frage kann nicht mehr geändert werden, da sie schon beantwortet wurde.\nWollen Sie eine Kopie dieser Frage erstellen und bearbeiten?",
            () => {
                this.model.duplicate()
                    .then(task => {
                        Backbone.history.navigate(`task/edit/${task.id}`, { trigger: true })
                        return null
                    })
                    .catch(error => {
                        showError('Error while copying task', error)
                    })
            }
        )
    }
})

export default TasksShowView
