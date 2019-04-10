import { View } from 'backbone.marionette'
import Backbone from 'backbone'
import Radio from 'backbone.radio'
import _ from 'underscore'
import template from '../hbs/poll.hbs'

const decorateContext = function(response, voting) {
    const task = voting.getTask(),
        { lrange_value, hrange_value, statements } = task.get('task')
    return {
        response: response.toJSON(),
        voting: _.omit(voting.toJSON(), 'task'),
        task: {
            ...task.toJSON(),
            initialValue: Math.floor((hrange_value + lrange_value) / 2)
        },
        statements
    }
}

export default View.extend({
    className: 'cliqr--scales-poll-view',

    events: {
        'submit form': 'onSubmitForm'
    },

    initialize({ voting }) {
        this.voting = voting
    },

    template,

    templateContext() {
        const task = this.voting.getTask(),
            { lrange_value, hrange_value, statements } = task.get('task')
        return {
            response: this.model.toJSON(),
            voting: _.omit(this.voting.toJSON(), 'task'),
            task: {
                ...task.toJSON(),
                initialValue: Math.floor((hrange_value + lrange_value) / 2)
            },
            statements
        }
    },

    onAttach() {
        Radio.channel('layout').request('apply:mathjax', this.$('.description, .text'))

        _.each(this.$('input[type="range"]'), range => {
            const $range = Backbone.$(range),
                ruler = $range
                    .parent()
                    .find('.rangeslider__ruler')
                    .get(0),
                output = $range
                    .parent()
                    .find('output')
                    .get(0)

            $range.rangeslider({
                polyfill: false,
                onInit() {
                    this.$range.prepend(ruler)
                    output.textContent = this.value
                },
                onSlide(position, value) {
                    output.textContent = value
                }
            })
        })
    },

    onSubmitForm(event) {
        event.preventDefault()
        const answer = _.map(this.$('input'), input => parseInt(input.value, 10))
        this.model.set('response', { answer })
        this.voting.trigger('newResponse', this.model, this.voting)
    }
})
