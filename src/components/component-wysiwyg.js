import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import template from './component-wysiwyg.hbs'

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
            this.editor.stopListening()
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
        this.$el.addClass('loading')
        const result = window.STUDIP.wysiwyg.replace(textarea)
        $(textarea).on("load.wysiwyg", () => {
            this.editor = window.STUDIP.wysiwyg.getEditor(textarea)
            this.onEditorReady()
            this.editor.model.document.on('change:data', this.onEditorChange.bind(this, textarea))
            textarea.addEventListener("invalid", this.onEditorInvalid.bind(this))
        })
    },

    onEditorReady() {
        this.$el.removeClass('loading')
    },

    onEditorChange(textarea) {
        const data = this.editor.getData()
        textarea.value = data;
        this.model.set(this.key, window.STUDIP.wysiwyg.markAsHtml(data))
    },

    onEditorInvalid() {
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
