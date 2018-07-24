import Viewmaster from '../../../views/viewmaster'
import template from '../hbs/component-switchable.hbs'
import WysiwygComponent from './component-wysiwyg'

const SwitchableComponent = Viewmaster.extend({
    tagName: 'span',
    className: 'cliqr--component-switchable',

    template,

    events: {
        'click .js-edit': 'onClickEdit'
    },

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.editable = false

        this.keys = options.keys
        this.listenTo(this.model, `change:${this.keys.edit}`, this.onModelChange)
    },

    context() {
        return {
            editable: this.editable,
            keys: this.keys,
            valueView: this.model.get(this.keys.view)
        }
    },

    onModelChange(model, change) {
        this.model.set(this.keys.edit, change)
    },

    onClickEdit(event) {
        event.stopPropagation()
        event.preventDefault()

        this.editable = true
        this.render()

        const wysiwyg = new WysiwygComponent({
            model: this.model,
            key: this.keys.edit
        })
        this.setView('.cliqr--component-switchable-wysiwyg', wysiwyg)
        this.refreshViews()
    }
})

export default SwitchableComponent
