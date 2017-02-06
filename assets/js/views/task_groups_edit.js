import Backbone from 'backbone'
import _ from 'underscore'
import Viewmaster from './viewmaster'

import Task from '../models/task'
import TaskCollection from '../models/tasks'

const decorateTaskGroup = function (model) {
    const taskGroup = model.toJSON()
    return {
        ...taskGroup,
        breadcrumb: {
            task_group_id: taskGroup.id,
            task_group_title: taskGroup.test.title
        }
    }
}

const TaskGroupsEditView = Viewmaster.extend({

    tagName: 'article',
    className: 'cliqr--task-groups-show',

    events: {
        'submit form': 'onClickEditTaskGroup',
        'click .js-cancel': 'onClickCancel'
    },

    template: require('../../hbs/task-groups-edit.hbs'),

    context() {
        return decorateTaskGroup(this.model)
    },

    onClickEditTaskGroup(event) {
        event.preventDefault()

        const title = this.$('form')[0].title.value.trim()

        if (!title.length) {
            return
        }

        this.model.save({ title })
            .then(() => Backbone.history.navigate(`task-groups/show/${this.model.id}`, { trigger: true }))
    },

    onClickCancel() {
        Backbone.history.navigate(`task-groups/show/${this.model.id}`, { trigger: true })
    }
})

export default TaskGroupsEditView
