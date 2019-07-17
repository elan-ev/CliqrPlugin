import FormView from './form'

export default FormView.extend({
    className: 'cliqr--multiple-choice-edit-view',

    onSubmitForm(event) {
        event.preventDefault()

        this.model.set('task', {
            ...this.model.get('task'),
            answers: this.choices.toJSON()
        })
        if (this.model.isValid()) {
            this.trigger('editTask', this.model)
        }
    },

    onClickCancel(event) {
        event.preventDefault()
        this.trigger('cancel', this.model)
    }
})
