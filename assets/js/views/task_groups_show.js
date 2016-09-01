import Backbone from 'backbone'
import _ from 'underscore'

import Task from '../models/task'
import TaskCollection from '../models/tasks'

import Viewmaster from './viewmaster'
import TaskListView from './task_list'
import TasksAddView from './tasks_add'

const decorateTaskGroup = function (model) {
    return {
        ...model.toJSON()
    }
}

const TaskGroupsShowView = Viewmaster.extend({

    className: 'page task-groups-show',

    events: {
    },

    tasks: null,

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        this.listenTo(this.model, 'newTask', this.onNewTask);

        this.tasks = new TaskCollection(this.model.get('test').tasks)

        //this.listenTo(this.tasks, 'add', this.onTaskAdded)
        //this.listenTo(this.tasks, 'remove', this.onTaskRemoved)

        this.setView('.task-list-container', new TaskListView({ collection: this.tasks }))
        this.setView('.task-create-container', new TasksAddView({ model: this.model }))
    },


    template(context) {
        const template = require('../../hbs/task-groups-show.hbs')
        return template(context)
    },

    context() {
        return decorateTaskGroup(this.model)
    },

    onNewTask(task) {
        this.tasks.create({ ...task.attributes, task_group_id: this.model.id }, {
            success: (...args) => {
                console.log("TODO onNewTask success", args)
            }
        })
    }
})

export default TaskGroupsShowView
