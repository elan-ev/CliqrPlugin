import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import template from '../../hbs/component-wysiwyg.hbs'

export default View.extend({
    tagName: 'div',
    className: 'cliqr--component-wysiwyg',

    template,

    events: {
        'keypress textarea': 'onTextUpdate',
        'change textarea': 'onTextUpdate',
        'input textarea': 'onTextUpdate'
    },

    modelEvents() {
        return {
            [`change:${this.key}`]: 'onModelChange'
        }
    },

    initialize(options) {
        this.key = options.key
        this.error = null
    },

    editor: null,

    onBeforeDestroy() {
        if (this.editor) {
            this.editor.removeAllListeners()
            this.editor = null
        }
    },

    templateContext() {
        return {
            error: this.error,
            key: this.key,
            value: this.model.get(this.key)
        }
    },

    onAttach() {
        const textarea = this.$('textarea').get(0)
        if (!textarea || !window.STUDIP.wysiwyg || !window.STUDIP.wysiwyg.replace) {
            return
        }

        const placeholder = textarea.placeholder || ''

        this.$el.addClass('loading')
        window.STUDIP.wysiwyg.replace(textarea)
        const element = window.CKEDITOR.dom.element.get(textarea)
        if (element) {
            this.editor = element.getEditor()
            this.editor.config.placeholder = placeholder
            this.editor.on('instanceReady', this.onEditorReady, this)
            this.editor.on('change', this.onEditorChange, this)
            this.editor.once('focus', this.onEditorFocus, this)

            this.editor.on('required', this.onEditorInvalid, this)
        }
    },

    onEditorReady() {
        this.$el.removeClass('loading')
    },

    onEditorChange({ editor }) {
        const data = window.STUDIP.wysiwyg.markAsHtml(editor.getData())
        this.model.set(this.key, data)
    },

    onEditorFocus({ editor }) {
        // expand toolbar on focus
        if (this.$('.cke_toolbox_collapser_min').length) {
            editor.execCommand('toolbarCollapse')
        }
    },

    onEditorInvalid(evt) {
        evt.cancel()
        this.error = 'Dieses Feld darf nicht leer sein.'
        this.render()
        this.el.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
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
