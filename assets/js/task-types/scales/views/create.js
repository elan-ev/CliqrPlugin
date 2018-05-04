import FormView from './form'

const CreateView = FormView.extend({
    className: 'cliqr--scales-create-view',

    // eslint-disable-line no-unused-vars
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
