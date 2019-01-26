import { View } from 'backbone.marionette'
import template from '../hbs/form-choice.hbs'

export default View.extend({
    tagName: 'div',
    className: 'choice-input',

    template,
    templateContext() {
        return {
            index: this.model.collection.indexOf(this.model)
        }
    },

    ui: {
        choice: 'input.choice',
        remove: '.js-remove'
    },

    triggers: {
        'change @ui.choice': 'update:choice',
        'input @ui.choice': 'update:choice',

        'click @ui.remove': 'remove:choice'
    },

    initialize() {
        // re-render index
        this.listenTo(this.model.collection, 'remove', this.render)
    },

    onUpdateChoice() {
        this.model.set('text', this.$('input').val())
    },

    onRemoveChoice() {
        // workaround for tooltips staying too long
        this.getUI('remove').remove()
    }
})
