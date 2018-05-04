import Backbone from 'backbone'
import Viewmaster from '../../../views/viewmaster'
import template from '../hbs/component-text-input.hbs'

const TextInputComponent = Viewmaster.extend({
    tagName: 'span',
    className: 'cliqr--component-text-input',

    template,

    events: {
        'keypress input': 'onTextUpdate',
        'change input': 'onTextUpdate',
        'input input': 'onTextUpdate'
    },

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.key = options.key
        this.placeholderKey = options.placeholderKey
        this.listenTo(this.model, `change:${this.key}`, this.onModelChange)
        this.listenTo(this.model, `change:${this.placeholderKey}`, this.render)
    },

    context() {
        return {
            key: this.key,
            placeholder: this.placeholderKey && this.model.get(this.placeholderKey),
            value: this.model.get(this.key)
        }
    },

    onModelChange(model, change) {
        this.model.set(this.key, change)
    },

    onTextUpdate(event) {
        this.model.set(this.key, Backbone.$(event.target).val())
    }
})

export default TextInputComponent
