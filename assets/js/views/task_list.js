import Backbone from 'backbone'
import _ from 'underscore'

import Viewmaster from './viewmaster'
import TaskListItemView from './task_list_item'


const TaskListView = Viewmaster.extend({

    className: 'cliqr--task-list',

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        this.listenTo(this.collection, 'add', this.onTaskAdded)
        this.listenTo(this.collection, 'remove', this.onTaskRemoved)

        this.collection.each(this.appendItem, this)
    },

    template: require('../../hbs/task-list.hbs'),

    context() {
        return {
            taskGroup: this.model.toJSON(),
            tasks: this.collection.toJSON()
        }
    },

    appendItem(model) {
        this.appendView('.cliqr--task-list tbody', new TaskListItemView({ model }))
    },

    onTaskAdded(model) {
        this.appendItem(model)
        this.refreshViews()
    },

    onTaskRemoved(model) {
//        this.refreshViews()
    }
})

export default TaskListView
