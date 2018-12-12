import Backbone from 'backbone'
import _ from 'underscore'
import { showConfirmDialog } from '../dialog'
import showError from '../error'
import taskTypes from '../models/task_types'
import Viewmaster from './viewmaster'

const TasksShowView = Viewmaster.extend({
    tagName: 'article',

    className: 'cliqr--tasks-show',

    events: {
        'click .js-start': 'onClickStart',
        'click .js-stop': 'onClickStop',
        'click .js-remove': 'onClickRemoveVoting'
    },

    taskType: null,

    initialize({ store }) {
        Viewmaster.prototype.initialize.call(this)

        const taskGroup = store.taskGroups.get(this.model.get('task_group_id'))
        store.trigger('navigation', 'task-group', taskGroup)

        taskTypes
            .fetchTaskType(this.model)
            .then(taskType => {
                this.taskType = taskType

                const view = this.taskType.getShowView()
                this.setView('main', view)
                this.refreshViews()

                view && _.isFunction(view.postRender) && view.postRender()

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
            votings: votings
                .map(function(v) {
                    return {
                        ...v.toJSON(),
                        running: v.isRunning()
                    }
                })
                .reverse(),
            breadcrumb: {
                task_group_id: task.task_group_id,
                task_group_title: task.task_group_title
            }
        }
    },

    onClickStart(event) {
        event.preventDefault()
        this.model.startVoting()
            .then(voting => {
                Backbone.history.navigate(`voting/${voting.id}`, { trigger: true })
                return null
            })
            .catch(response => {
                showError('Could not start voting', response)
            })
    },

    onClickStop(event) {
        event.preventDefault()

        const running = this.model.getVotings().find(a => a.isRunning())
        running
            .stop()
            .then(() => {
                this.render()
                return null
            })
            .catch(response => {
                showError('Could not stop voting', response)
            })
    },

    onClickRemoveVoting(event) {
        event.preventDefault()
        const voting = this.model.getVotings().get(
            Backbone.$(event.target)
                .closest('.cliqr--votings-list-item')
                .data('votingid')
        )
        if (!voting) {
            return
        }
        showConfirmDialog(`Wollen Sie diese Abstimmung wirklich löschen?`, () => {
            voting
                .destroy()
                .then(() => {
                    this.render()
                    return null
                })
                .catch(error => {
                    showError('Could not remove voting', error)
                })
        })
    }
})

export default TasksShowView
