import Backbone from 'backbone'
import _ from 'underscore'

import Viewmaster from '../../views/viewmaster'

const decorateContext = function (response, voting) {
    const task = voting.getTask()
    return {
        response: response.toJSON(),
        voting: _.omit(voting.toJSON(), 'task'),
        task: task.toJSON(),
        answers: task.get('task').answers,
        isSingleSelect: task.get('task').type === 'single'
    }
}

const PollView = Viewmaster.extend({

    className: 'cliqr--multiple-choice-poll-view',

    events: {
        'submit form': 'onSubmitForm'
    },


    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.voting = options.voting
    },

    template: require('./multiple-choice-poll.hbs'),

    context() {
        return decorateContext(this.model, this.voting)
    },

    postRender() {
    },

    onSubmitForm(event) {
        event.preventDefault()

        const ary = Backbone.$(event.target).closest('form').serializeArray()
        this.model.set('response', { answer: _.map(ary, (input) => parseInt(input.value, 10)) })

        this.voting.trigger('newResponse', this.model, this.voting)
    }
})

export default PollView
