import Backbone from 'backbone'

import showError from '../error'
import Viewmaster from './viewmaster'

const TaskGroupsEditView = Viewmaster.extend({

    tagName: 'article',
    className: 'cliqr--task-groups-show',

    events: {
        'submit form': 'onClickEditTaskGroup',
        'click .js-cancel': 'onClickCancel'
    },

    initialize({ store }) {
        Viewmaster.prototype.initialize.call(this)

        store.trigger('navigation', 'task-group', this.model)
    },

    template: require('../../hbs/task-groups-edit.hbs'),

    context() {
        const taskGroup = this.model.toJSON()
        return {
            ...taskGroup,
            breadcrumb: {
                task_group_id: taskGroup.id,
                task_group_title: taskGroup.title
            }
        }
    },

    onClickEditTaskGroup(event) {
        event.preventDefault()

        const title = this.$('form')[0].title.value.trim()

        if (!title.length) {
            return
        }

        this.model.save({ title })
            .then(() => {
                Backbone.history.navigate(`task-groups/show/${this.model.id}`, { trigger: true })
            })
            .catch(error => {
                showError('Could not edit task group', error)
            })
    },

    onClickCancel() {
        Backbone.history.navigate(`task-groups/show/${this.model.id}`, { trigger: true })
    }
})

export default TaskGroupsEditView
