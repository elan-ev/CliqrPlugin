import FormView from './form'

export default FormView.extend({
    className: 'cliqr--scales-create-view',

    onSubmitForm(event) {
        event.preventDefault()

        this.model.set('task', {
            ...this.model.get('task'),
            statements: this.statements.toJSON()
        })

        if (this.model.isValid()) {
            this.trigger('newTask', this.model)
        }
    },

    onClickCancel(event) {
        event.preventDefault()
        this.trigger('cancel')
    }
})
