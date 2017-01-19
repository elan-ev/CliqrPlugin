import Backbone from 'backbone'
import _ from 'underscore'

import Task from '../models/task'
import TaskCollection from '../models/tasks'

const decorateTaskGroup = function (model) {
    return {
        ...model.toJSON()
    }
}

const TaskGroupsEditView = Backbone.View.extend({

    tagName: 'article',
    className: 'cliqr--task-groups-show',

    events: {
        'click .js-edit-task-group': 'onClickEditTaskGroup',
        'click .js-cancel': 'onClickCancel'
    },

    initialize(option) {
        // console.log(this.model)
    },

    render() {
        const template = require('../../hbs/task-groups-edit.hbs')
        this.$el.html(template({ ...decorateTaskGroup(this.model) }))
        return this
    },

    onClickEditTaskGroup(event) {
        event.preventDefault()
        const $formData = Backbone.$(event.target.closest('form')).serializeArray(),
              formData = _.reduce(
                  $formData,
                  (memo, item) => _.tap(memo, (memo) => memo[item.name] = item.value),
                  {})

        this.model.save(formData)
            .then((taskGroup) => {
                Backbone.history.navigate(`#task-groups-${this.model.id}`, { trigger: true })
            })
    },

    onClickCancel() {
        Backbone.history.navigate(`#task-groups-${this.model.id}`, { trigger: true })
    }
})

export default TaskGroupsEditView
