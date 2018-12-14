import { View } from 'backbone.marionette'
import statementTemplate from '../hbs/form-statement.hbs'

export default View.extend({
    tagName: 'div',
    className: 'choice-input',

    template: statementTemplate,

    templateContext() {
        return {
            index: this.model.collection.indexOf(this.model)
        }
    },

    ui: {
        statement: 'input.choice',
        remove: '.js-remove'
    },

    triggers: {
        'change @ui.statement': 'update:statement',
        'input @ui.statement': 'update:statement',

        'click @ui.remove': 'remove:statement'
    },

    initialize() {
        // re-render index
        this.listenTo(this.model.collection, 'remove', this.render)
    },

    onUpdateStatement(
        view,
        {
            target: { value }
        }
    ) {
        this.model.set('text', value)
    },

    onRemoveStatement() {
        // workaround for tooltips staying too long
        this.getUI('remove').remove()
    }
})
