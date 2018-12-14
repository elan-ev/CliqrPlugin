import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import template from '../hbs/component-text-input.hbs'

export default View.extend({
    tagName: 'span',
    className: 'cliqr--component-text-input',

    template,

    events: {
        'keypress input': 'onTextUpdate',
        'change input': 'onTextUpdate',
        'input input': 'onTextUpdate'
    },

    modelEvents() {
        return {
            [`change:${this.key}`]: 'onModelChange',
            [`change:${this.placeholderKey}`]: 'render'
        }
    },

    initialize(options) {
        this.key = options.key
        this.placeholderKey = options.placeholderKey
    },

    templateContext() {
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
