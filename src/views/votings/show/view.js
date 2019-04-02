import Radio from 'backbone.radio'
import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import _ from 'underscore'
import { showConfirmDialog } from '../../../dialog'
import showError from '../../../error'
import taskTypes from '../../../models/task_types'
import Voting from '../../../models/voting'
import template from './show.hbs'

const decorateVoting = function(voting) {
    const task = voting.getTask().toJSON()
    const otherVotings = task.votings
        .filter(v => v.id !== voting.id)
        .map(attrs => ({ ...attrs, isRunning: new Voting(attrs).isRunning() }))

    return {
        responses_count: voting.get('responses_count'),
        task,
        isRunning: voting.isRunning(),
        otherVotings,
        breadcrumb: {
            task_group_id: task.task_group_id,
            task_group_title: task.task_group_title,
            task_id: task.id,
            task_title: task.title,
            voting_id: voting.id
        }
    }
}

export default View.extend({
    tagName: 'article',

    className: 'cliqr--votings-show',

    ui: {
        main: 'main',
        compare: '.js-compare'
    },

    regions: {
        mainRegion: '@ui.main'
    },

    events: {
        'click .js-stop': 'onClickStop',
        'click .js-restart': 'onClickRestart',
        'click .js-show-qr-code': 'onClickShowQRCode',
        'click @ui.compare': 'onClickCompare',
        'click .js-remove': 'onClickRemove'
    },

    modelEvents: {
        change: 'render'
    },

    interval: null,

    initialize({ store }) {
        const task = this.model.getTask()
        const taskGroup = store.taskGroups.get(task.get('task_group_id'))
        store.trigger('navigation', 'task-group', taskGroup)
        const title = task.getTitle(30)
        Radio.channel('layout').request('change:pagetitle', `Abstimmung «${title}»`)
    },

    onRender() {
        taskTypes
            .fetchTaskType(this.model.getTask())
            .then(taskType => {
                const view = taskType.getAssignmentView(this.model)
                this.showChildView('mainRegion', view)
            })
            .catch(error => {
                showError('Es ist ein Fehler aufgetreten.', error)
            })

        if (this.interval) {
            clearInterval(this.interval)
        }

        if (this.model.isRunning() && !this.interval) {
            this.interval = setInterval(() => {
                this.model.fetch()
            }, 2000)
        }

        Backbone.$(window.document.body).addClass('cliqr--voting-show')
    },

    onBeforeDestroy() {
        if (this.interval) {
            clearInterval(this.interval)
        }
        Backbone.$(window.document.body).removeClass('cliqr--voting-show')
    },

    template,

    templateContext() {
        return decorateVoting(this.model)
    },

    onClickStop(event) {
        event.preventDefault()
        this.model.stop()
    },

    onClickRestart(event) {
        event.preventDefault()
        const task = this.model.getTask()
        task.startVoting()
            .then(voting => {
                Backbone.history.navigate(`voting/${voting.id}`, { trigger: true })
                return null
            })
            .catch(error => {
                showError('Could not restart voting', error)
            })
    },

    onClickShowQRCode(event) {
        event.preventDefault()

        const dialog = Backbone.$(event.target)
            .closest('.button')
            .next('.dialog')

        window.STUDIP.Dialog.show(dialog.html(), {
            dialogClass: 'cliqr--dialog-qr',
            width: 600,
            height: 625,
            title: dialog.attr('title'),
            buttons: null,
            resize: true
        })
    },

    onClickCompare(event) {
        event.preventDefault()

        const thisVersion = this.model.id,
            otherVersion = Backbone.$(event.target)
                .closest('form')
                .find('select')
                .val()
        Backbone.history.navigate(`compare/${otherVersion}/${thisVersion}`, { trigger: true })

        // workaround for tooltips staying too long
        this.getUI('compare').remove()
    },

    onClickRemove(event) {
        event.preventDefault()
        const task = this.model.getTask()
        showConfirmDialog(`Wollen Sie diese Abstimmung wirklich löschen?`, () => {
            this.model
                .destroy()
                .then(() => {
                    Backbone.history.navigate(`task/show/${task.id}`, { trigger: true })
                    return null
                })
                .catch(error => {
                    showError('Could not remove voting', error)
                })
        })
    }
})
