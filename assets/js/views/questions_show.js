import Backbone from 'backbone'
import _ from 'underscore'
import utils from '../utils'

import TemplateView from './template_view'
import ResultsView from './questions_results_view'


const QuestionView = TemplateView.extend({

    template_id: 'questions-show',

    className: 'page questions-show',

    events: {
        'click button.start': 'startQuestion',
        'click button.stop': 'stopQuestion',
        'click a.qr': 'showQRCode',
        'submit form.questions-destroy': 'confirmDestroy',
        'click .fullscreen': 'showFS'
    },

    initialize() {
        this.resultsView = new ResultsView({
            model: this.model.toJSON().answers
        })

        this.listenTo(this.model, 'change:answers', this.updateAnswers)
        this.listenTo(this.model, 'change:state', this.updateState)

        this.interval = setInterval( () => this.model.fetch(), 2000)
    },

    remove() {
        clearInterval(this.interval)
        this.resultsView.remove()
        TemplateView.prototype.remove.call(this)
    },

    render() {
        const context = _.extend(this.model.toJSON(), {
            qr_code: cliqr.config.PLUGIN_URL + 'qr/' + cliqr.config.CID,
            short_url: cliqr.config.SHORT_URL
        })
        this.$el.html(this.template(context))
        this.$('.results').replaceWith(this.resultsView.render().el)
        return this
    },

    postRender() {
        this.resultsView.postRender()
        this.$('.vote .url').fitText()
    },

    updateAnswers(model, answers, options) {
        this.resultsView.update(answers)
    },

    updateState(model, state, options) {
        this.render()
        this.postRender()
    },

    showQRCode(event) {
        event.preventDefault()

        const dialog = Backbone.$(event.target).closest('.vote').find('.dialog')
        Backbone.$(document).one('dialog-open', function(event, parameters) {
            Backbone.$(parameters.dialog).fitText()
        })
        STUDIP.Dialog.show(dialog.html(), {
            id: 'dialog-qr',
            width: 550,
            height: 700,
            title: dialog.attr('title'),
            resize: false
        })
        this.$('.question').toggleClass('qr-visible')
    },

    confirmDestroy(event) {
        if (!window.confirm(Backbone.$(event.target).data('confirm'))) {
            event.preventDefault()
        }
    },

    showFS(event) {
        event.preventDefault();

        const methods = ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen']
        _.each(methods, (method) => {
            if (this.el[method]) {
                this.el[method]()
            }
        })
    },

    startQuestion(event) {
        event.preventDefault()
        this.$('.appeal.start').addClass('busy')
        this.model.start().done(() => this.model.fetch())
    },

    stopQuestion(event) {
        event.preventDefault();
        this.model.stop().done(() => this.model.fetch())
    }
})

export default QuestionView
