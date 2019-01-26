import { View } from 'backbone.marionette'
import template from '../hbs/component-switchable.hbs'
import nonEditTemplate from '../hbs/component-switchable-noneditable.hbs'
import WysiwygComponent from '../../../components/component-wysiwyg'

const NonEditableView = View.extend({
    template: nonEditTemplate,
    templateContext() {
        return { valueView: this.valueView }
    },
    initialize({ valueView }) {
        this.valueView = valueView
    }
})

export default View.extend({
    tagName: 'span',
    className: 'cliqr--component-switchable',

    template,

    regions: {
        wysiwyg: '.cliqr--component-switchable-wysiwyg'
    },

    events: {
        'click .js-edit': 'onClickEdit'
    },

    modelEvents() {
        return {
            [`change:${this.keys.edit}`]: 'onModelChange'
        }
    },

    initialize({ keys }) {
        this.editable = false
        this.keys = keys
    },

    onRender() {
        this.showChildView(
            'wysiwyg',
            this.editable
                ? new WysiwygComponent({
                      model: this.model,
                      key: this.keys.edit
                  })
                : new NonEditableView({
                      valueView: this.model.get(this.keys.view)
                  })
        )
    },

    onModelChange(model, change) {
        this.model.set(this.keys.edit, change)
    },

    onClickEdit(event) {
        event.stopPropagation()
        event.preventDefault()
        this.editable = true
        this.render()
    }
})
