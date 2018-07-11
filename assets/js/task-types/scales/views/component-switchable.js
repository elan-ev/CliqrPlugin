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

        this.key = options.key
        this.listenTo(this.model, `change:${this.key}`, this.onModelChange)
    },

    context() {
        return {
            editable: this.editable,
            key: this.key,
            value: this.model.get(this.key)
        }
    },

    onModelChange(model, change) {
        this.model.set(this.key, change)
    },

    onClickEdit(event) {
        event.stopPropagation()
        event.preventDefault()

        this.editable = true
        this.render()

        const wysiwyg = new WysiwygComponent({
            model: this.model,
            key: 'description'
        })
        this.setView('.cliqr--component-switchable-wysiwyg', wysiwyg)
        this.refreshViews()
    }
})

export default SwitchableComponent
