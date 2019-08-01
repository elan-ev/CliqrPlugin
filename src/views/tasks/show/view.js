import Radio from 'backbone.radio'
import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import { showConfirmDialog } from '../../../dialog'
import showError from '../../../error'
import taskTypes from '../../../models/task_types'
import template from './show.hbs'

export default View.extend({
    tagName: 'article',

    className: 'cliqr--tasks-show',

    ui: {
        main: 'main',
        remove: '.js-remove',
        start: '.js-start',
        stop: '.js-stop'
    },

    regions: {
        mainRegion: '@ui.main'
    },

    events: {
        'click @ui.start': 'onClickStart',
        'click @ui.stop': 'onClickStop',
        'click @ui.remove': 'onClickRemoveVoting'
    },

    initialize({ store }) {
        const taskGroup = store.taskGroups.get(this.model.get('task_group_id'))
        store.trigger('navigation', 'task-group', taskGroup)
        const title = this.model.getTitle(30)
        Radio.channel('layout').request('change:pagetitle', `Frage «${title}»`)
    },

    template,

    templateContext() {
        const votings = this.model.getVotings()

        return {
            isRunning: this.model.getCurrentState() === 'is_active',
            votings: votings.map(v => ({ ...v.toJSON(), running: v.isRunning() })).reverse(),
            breadcrumb: {
                task_group_id: this.model.get('task_group_id'),
                task_group_title: this.model.get('task_group_title'),
                task_id: this.model.id,
                task_title: this.model.getTitle()
            }
        }
    },

    onRender() {
        taskTypes.fetchTaskType(this.model)
            .then(taskType => {
                const view = taskType.getShowView()
                if (view) {
                    this.showChildView('mainRegion', view)
                }

                return null
            })
            .catch(error => {
                showError('Es ist ein Fehler aufgetreten.', error)
            })
    },

    onClickStart(event) {
        event.preventDefault()
        this.model
            .startVoting()
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
        if (!running) {
            // something is wrong; user clicked a `stop` button though no voting was active
            // just reload everything
            window.location.reload(true)
            return
        }

        running
            .stop()
            .then(() => {
                Backbone.history.navigate(`voting/${running.id}`, { trigger: true })
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
