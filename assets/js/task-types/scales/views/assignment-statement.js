import { View } from 'backbone.marionette'
import _ from 'underscore'
import template from '../hbs/assignment-statement.hbs'
import histogramView from './histogram'

export default View.extend({
    tagName: 'li',
    template,

    modelEvents: {
        change: 'render'
    },

    initialize(options) {
        this.voting = options.voting
        this.listenTo(this.voting, 'change', this.render)

        const index = this.model.collection.indexOf(this.model)
        this.responses = this.voting.get('responses').map(r => r.answer && r.answer[index])
    },

    templateContext() {
        return { isRunning: this.voting.isRunning() }
    },

    onAttach() {
        const Hub = window.MathJax.Hub
        Hub.Queue(['Typeset', Hub, this.$('.text')[0]])

        if (!this.voting.isRunning()) {
            const { lrange_value, hrange_value } = this.voting.getTask().get('task')
            histogramView(this.$el, this.responses, lrange_value, hrange_value)
        }
    }
})
