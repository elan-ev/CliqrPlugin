import Backbone from 'backbone'
import Viewmaster from '../../../views/viewmaster'

const WysiwygComponent = Viewmaster.extend({

    tagName: 'div',
    className: 'cliqr--component-wysiwyg',

    events: {
        'keypress textarea': 'onTextUpdate',
        'change textarea': 'onTextUpdate',
        'input textarea': 'onTextUpdate'
    },

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.key = options.key
        this.listenTo(this.model, `change:${this.key}`, this.onModelChange)
    },

    remove() {
        this.removeWysiwyg()
        Viewmaster.prototype.remove.call(this)
    },

    editor: null,

    removeWysiwyg() {
        if (this.editor) {
            this.editor.removeAllListeners()
            this.editor = null
        }
    },

    template: require('../hbs/component-wysiwyg.hbs'),

    context() {
        return {
            key: this.key,
            value: this.model.get(this.key)
        }
    },

    afterTemplate() {
        const textarea = this.$('textarea').get(0)
        if (!textarea || !window.STUDIP.wysiwyg) {
            return
        }

        window.STUDIP.wysiwyg.replace(textarea)
        const element = window.CKEDITOR.dom.element.get(textarea)
        if (element) {
            this.editor = element.getEditor()
            this.editor.on('change', this.onEditorChange, this)
            this.editor.once('focus', this.onEditorFocus, this)
        }
    },

    onEditorChange({ editor }) {
        this.model.set(this.key, editor.getData(), { silent: true })
    },

    onEditorFocus({ editor }) {
        // expand toolbar on focus
        if (this.$('.cke_toolbox_collapser_min').length) {
            editor.execCommand('toolbarCollapse')
        }
    },

    onTextUpdate(event) {
        const value = Backbone.$(event.target).val()
        this.model.set(this.key, value, { silent: true })
        // console.log(this.model.get(this.key))
    },

    onModelChange(...args) {
        this.render()
    }
})

export default WysiwygComponent
