import FormView from './form'

const CreateView = FormView.extend({

    className: 'cliqr--multiple-choice-create-view',

    onSubmitForm(event) {
        event.preventDefault()
        if (this.model.isValid()) {
            this.trigger('newTask', this.model)
        }
    },

    onClickCancel(event) {
        event.preventDefault()
        this.trigger('cancel')
    }
})

export default CreateView
