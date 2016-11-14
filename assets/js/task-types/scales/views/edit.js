import FormView from './form'

const EditView = FormView.extend({

    className: 'cliqr--scales-edit-view',

    onSubmitForm(event) {
        event.preventDefault()
        if (this.model.isValid()) {
            this.type.trigger('editTask', this.model)
        }
    },

    onClickCancel(event) {
        event.preventDefault()
        Backbone.history.navigate(`/task/show/${this.model.id}`, { trigger: true })
    }
})

export default EditView
