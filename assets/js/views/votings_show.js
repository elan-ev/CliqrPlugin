import Backbone from 'backbone'
import _ from 'underscore'

import Task from '../models/task'
import Voting from '../models/voting'
import taskTypes from '../models/task_types'

import Viewmaster from './viewmaster'

const decorateVoting = function (voting) {
    return {
        ..._.omit(voting.toJSON(), 'test'),
        task: voting.getTask().toJSON(),
        isRunning: voting.isRunning()
    }
}

const VotingsShowView = Viewmaster.extend({

    className: 'page votings-show',

    events: {
        'click .js-stop': 'onClickStop',
        'click .js-restart': 'onClickRestart',
        'click .js-show-qr-code': 'onClickShowQRCode'
    },

    taskType: null,

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        const task = this.model.getTask()
        this.taskType = taskTypes.getTaskType(task)

        this.listenTo(this.model, 'change', this.render)

        this.setView('main', this.taskType.getAssignmentView(this.model))
    },

    remove() {
        //clearInterval(this.interval)
        Backbone.View.prototype.remove.call(this)
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
                Backbone.history.navigate(`voting-${voting_id}`, { trigger: true })
                return model;
            })
    },

    onClickShowQRCode(event) {
        event.preventDefault()

        const dialog = Backbone.$(event.target).closest('.button').next('.dialog')

        Backbone.$(window.document).one('dialog-open', (event, parameters) => Backbone.$(parameters.dialog).fitText())

        window.STUDIP.Dialog.show(dialog.html(), {
            id: 'dialog-qr',
            width: 550,
            height: 700,
            title: dialog.attr('title'),
            resize: false
        })
    }
})

export default VotingsShowView
