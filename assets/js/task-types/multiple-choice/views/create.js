import FormView from './form'

const CreateView = FormView.extend({

    className: 'cliqr--multiple-choice-create-view',

    onSubmitForm(event) {
        event.preventDefault()
        if (this.model.isValid()) {
            this.taskGroup.trigger('newTask', this.model)
        }
    }
})

export default CreateView
