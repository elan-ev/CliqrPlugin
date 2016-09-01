import Backbone from 'backbone'
import _ from 'underscore'

import Viewmaster from './viewmaster'
import TaskListItemView from './task_list_item'


const TaskListView = Viewmaster.extend({

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        this.listenTo(this.collection, 'add', this.onTaskAdded)
        this.listenTo(this.collection, 'remove', this.onTaskRemoved)

        this.collection.each((model) => this.appendView('ol.task-list', new TaskListItemView({ model })))
    },


    template(context){
        const template = require('../../hbs/task-list.hbs')
        return template(context)
    },

    context() {
        return { tasks: this.collection.toJSON() }
    },

    onTaskAdded(model) {
        this.appendView('ol.task-list', new TaskListItemView({ model }))
        this.refreshViews()
    },

    onTaskRemoved(model) {
//        this.refreshViews()
    }
})

export default TaskListView
