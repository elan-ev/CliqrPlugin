import FormView from './form'

const CreateView = FormView.extend({

    className: 'cliqr--multiple-choice-create-view',

    onSubmitForm(event) {
        event.preventDefault()
        if (this.model.isValid()) {
            if (window.STUDIP.editor_enabled) {
                this.model.set(
                    'description',
                    window.STUDIP.wysiwyg.markAsHtml(
                        this.model.get('description')
                    ),
                    { silent: true }
                )
            }

            this.trigger('newTask', this.model)
        }
    },

    onClickCancel(event) {
        event.preventDefault()
        this.trigger('cancel')
    }
})

export default CreateView
