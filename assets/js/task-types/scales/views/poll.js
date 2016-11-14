import Backbone from 'backbone'
import _ from 'underscore'

import Viewmaster from '../../../views/viewmaster'

const decorateContext = function (response, voting) {
    const task = voting.getTask(),
        { lrange_value, hrange_value, statements } = task.get('task')
    return {
        response: response.toJSON(),
        voting: _.omit(voting.toJSON(), 'task'),
        task: {
            ...task.toJSON(),
            initialValue: lrange_value + Math.floor((hrange_value - lrange_value) / 2)
        },
        statements
    }
}

const PollView = Viewmaster.extend({

    className: 'cliqr--scales-poll-view',

    events: {
        'submit form': 'onSubmitForm'
    },

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.voting = options.voting
    },

    template: require('../hbs/poll.hbs'),

    context() {
        return decorateContext(this.model, this.voting)
    },

    postRender() {
        const Hub = window.MathJax.Hub
        this.$('.description, .text').each((index, element) => Hub.Queue([ 'Typeset', Hub, element ]))

        if (window.document.contains(this.el)) {
            _.each(this.$('input[type="range"]'), (range) => {
                const $range = Backbone.$(range),
                    ruler = $range.parent().find('.rangeslider__ruler').get(0),
                    output = $range.parent().find('output').get(0)

                $range.rangeslider(
                    {
                        polyfill: false,
                        onInit() {
                            this.$range.prepend(ruler)
                            output.textContent = this.value
                        },
                        onSlide(position, value) {
                            output.textContent = value
                        }
                    }
                )
            })
        }
    },

    onSubmitForm(event) {
        event.preventDefault()
        const answer = _.map(this.$('input'), input => parseInt(input.value, 10))
        this.model.set('response', { answer })
        this.voting.trigger('newResponse', this.model, this.voting)
    }
})

export default PollView
