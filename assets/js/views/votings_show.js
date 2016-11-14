import Backbone from 'backbone'
import _ from 'underscore'

import Task from '../models/task'
import Voting from '../models/voting'
import taskTypes from '../models/task_types'

import Viewmaster from './viewmaster'

const decorateVoting = function (voting) {
    const task = voting.getTask()
    return {
        ..._.omit(voting.toJSON(), 'test'),
        responses_count: voting.get('responses').length,
        task: task.toJSON(),
        isRunning: voting.isRunning(),
        otherVotings: _.map(_.reject(task.get('votings'), (v) => v.id === voting.id), (attrs) => { return { ...attrs, isRunning: new Voting(attrs).isRunning() } })
    }
}

const VotingsShowView = Viewmaster.extend({

    tagName: 'article',

    className: 'cliqr--votings-show',

    events: {
        'click .js-stop': 'onClickStop',
        'click .js-restart': 'onClickRestart',
        'click .js-show-qr-code': 'onClickShowQRCode',
        'click .js-compare': 'onClickCompare'
    },

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        this.listenTo(this.model, 'change', this.render)

        const task = this.model.getTask(),
              taskType = taskTypes.getTaskType(task)

        this.setView('main', taskType.getAssignmentView(this.model))

        if (this.model.isRunning()) {
            this.interval = setInterval( () => this.model.fetch(), 2000)
        }
    },

    postRender() {
        Backbone.$(window.document.body).addClass('cliqr--voting-show')
        const mainViews = this.getViews('main')
        if (mainViews.length) {
            mainViews[0].postRender && mainViews[0].postRender()
        }
    },

    remove() {
        Viewmaster.prototype.remove.call(this)

        if (this.interval) {
            clearInterval(this.interval)
        }
        Backbone.$(window.document.body).removeClass('cliqr--voting-show')
    },

    template: require('../../hbs/votings-show.hbs'),

    context() {
        return decorateVoting(this.model)
    },

    onClickStop(event) {
        event.preventDefault()
        this.model.save({ end: new Date().toISOString() })
    },

    onClickRestart(event) {
        event.preventDefault()
        const task_id = this.model.getTask().id,
              vtng = new Voting({ task_id })
        vtng.save()
            .then((model) => {
                const voting_id = model.id
                Backbone.history.navigate(`voting/${voting_id}`, { trigger: true })
                return null
            })
    },

    onClickShowQRCode(event) {
        event.preventDefault()

        const dialog = Backbone.$(event.target).closest('.button').next('.dialog')

        window.STUDIP.Dialog.show(dialog.html(), {
            dialogClass: 'cliqr--dialog-qr',
            width: 650,
            height: 700,
            title: dialog.attr('title'),
            buttons: null,
            resize: true
        })
    },

    onClickCompare(event) {
        event.preventDefault()

        const thisVersion = this.model.id,
              otherVersion = Backbone.$(event.target).closest('form').find('select').val()
        Backbone.history.navigate(`compare/${otherVersion}/${thisVersion }`, { trigger: true })
    }
})

export default VotingsShowView
