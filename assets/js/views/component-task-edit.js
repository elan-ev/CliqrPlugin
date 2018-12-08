import Backbone from 'backbone'
import Viewmaster from './viewmaster'
import { showConfirmDialog } from '../dialog'
import showError from '../error'
import _ from 'underscore'

const TaskEditComponent = Viewmaster.extend({
    tagName: 'span',
    className: 'cliqr--component-task-edit',

    template: require('../../hbs/component-task-edit.hbs'),

    events: {
        'click .js-edit': 'onClickEdit',
        'click .js-copy-edit': 'onClickCopyEdit'
    },

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        console.log("options:", options)
    },

    context() {
        const task = this.model.toJSON()
        const editable = !_.some(this.model.getVotings().models, v => v.get('responses_count'))

        return { task, editable }
    },

    onClickEdit() {
        Backbone.history.navigate(`task/edit/${this.model.id}`, { trigger: true })
    },

    onClickCopyEdit() {
        showConfirmDialog(
            'Diese Frage kann nicht mehr geändert werden, da sie schon beantwortet wurde.\nWollen Sie eine Kopie dieser Frage erstellen und bearbeiten?',
            () => {
                this.model
                    .duplicate()
                    .then(task => {
                        Backbone.history.navigate(`task/edit/${task.id}`, { trigger: true })
                        return null
                    })
                    .catch(error => {
                        showError('Error while copying task', error)
                    })
            }
        )
    }
})

export default TaskEditComponent
