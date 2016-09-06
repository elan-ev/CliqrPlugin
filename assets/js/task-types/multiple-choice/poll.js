import Backbone from 'backbone'
import _ from 'underscore'

const decorateContext = function (response, voting) {
    const task = voting.getTask(),
          json = voting.toJSON()
    return {
        response: response.toJSON(),
        voting: _.omit(voting.toJSON(), 'task'),
        task: task.toJSON(),
        answers: task.get('task').answers,
        isSingleSelect: task.get('task').type === 'single'
    }
}

const PollView = Backbone.View.extend({

    className: 'cliqr--multiple-choice-poll-view',

    events: {
        'submit form': 'onSubmitForm'
    },


    initialize(options) {
        this.voting = options.voting
    },

    remove() {
        Backbone.View.prototype.remove.call(this)
    },

    render() {
        const template = require('./multiple-choice-poll.hbs')
        this.$el.html(template(decorateContext(this.model, this.voting)))
        return this
    },

    onSubmitForm(event) {
        event.preventDefault()

        const ary = Backbone.$(event.target).closest('form').serializeArray()
        this.model.set('response', { answer: _.map(ary, (input) => parseInt(input.value, 10)) })

        this.voting.trigger('newResponse', this.model, this.voting)
    }
})

export default PollView
