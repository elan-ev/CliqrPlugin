import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import _ from 'underscore'
import template from '../../hbs/component-task-edit.hbs'
import { showConfirmDialog } from '../dialog'
import showError from '../error'

export default View.extend({
    tagName: 'span',
    className: 'cliqr--component-task-edit',

    events: {
        'click .js-edit': 'onClickEdit',
        'click .js-copy-edit': 'onClickCopyEdit'
    },

    template,

    templateContext() {
        const editable = !_.some(this.model.getVotings().models, v => v.get('responses_count'))
        return { editable }
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
