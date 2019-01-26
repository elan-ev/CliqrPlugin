import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import template from '../hbs/assignment.hbs'
import StatementsView from './assignment-statements'

export default View.extend({
    tagName: 'section',
    className: 'cliqr--scales-assignment-view',

    regions: {
        statements: 'main'
    },

    initialize({ voting }) {
        this.voting = voting
        this.statements = new Backbone.Collection(this.model.get('task').statements)
    },

    template,

    templateContext() {
        return {
            start: this.voting.get('start'),
            task: this.model.toJSON(),
            isRunning: this.voting.isRunning()
        }
    },

    onRender() {
        const statements = new StatementsView({
            collection: this.statements,
            voting: this.voting
        })
        this.showChildView('statements', statements)
    },

    onAttach() {
        if (window.MathJax) {
            const Hub = window.MathJax.Hub
            Hub.Queue(['Typeset', Hub, this.$('.cliqr--scales-description')[0]])
        }
    }
})
