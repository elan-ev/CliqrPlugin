import FormView from './form'

export default FormView.extend({
    className: 'cliqr--scales-edit-view',

    onSubmitForm(event) {
        event.preventDefault()

        this.model.set('task', {
            ...this.model.get('task'),
            statements: this.statements.toJSON()
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
