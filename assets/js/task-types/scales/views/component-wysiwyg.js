import Backbone from 'backbone'
import Viewmaster from '../../../views/viewmaster'
import template from '../hbs/component-wysiwyg.hbs'

const WysiwygComponent = Viewmaster.extend({
    tagName: 'div',
    className: 'cliqr--component-wysiwyg',

    template,

    events: {
        'keypress textarea': 'onTextUpdate',
        'change textarea': 'onTextUpdate',
        'input textarea': 'onTextUpdate'
    },

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.key = options.key
        this.listenTo(this.model, `change:${this.key}`, this.onModelChange)

        // window.CKEDITOR && window.CKEDITOR.on('instanceCreated',  (c) => console.log("created", c.editor))
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

    context() {
        return {
            key: this.key,
            value: this.model.get(this.key)
        }
    },

    afterTemplate() {
        const textarea = this.$('textarea').get(0)
        if (!textarea || !window.STUDIP.wysiwyg || !window.STUDIP.wysiwyg.replace) {
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
        const data = window.STUDIP.wysiwyg.markAsHtml(
            editor.getData()
        )
        this.model.set(this.key, data)
    },

    onEditorFocus({ editor }) {
        // expand toolbar on focus
        if (this.$('.cke_toolbox_collapser_min').length) {
            editor.execCommand('toolbarCollapse')
        }
    },

    onTextUpdate(event) {
        this.model.set(this.key, Backbone.$(event.target).val())
    },

    onModelChange(model, newDescription) {
        if (newDescription !== this.model.get(this.key)) {
            this.render()
        }
    }
})

export default WysiwygComponent
