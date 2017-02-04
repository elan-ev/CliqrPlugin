import Backbone from 'backbone'
import _ from 'underscore'

import Task from '../models/task'
import TaskCollection from '../models/tasks'

import Viewmaster from './viewmaster'
import TaskListView from './task_list'

const TaskGroupsShowView = Viewmaster.extend({

    className: 'task-groups-show',

    tasks: null,

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        this.tasks = new TaskCollection(this.model.get('test').tasks)
        this.setView('.task-list-container', new TaskListView({ collection: this.tasks, model: this.model }))
    },

    template: require('../../hbs/task-groups-show.hbs'),

    context() {
        return this.model.toJSON()
    },

    postRender() {
        this.eachView((sel, v) => { v && v.postRender && v.postRender() })
    }
})

export default TaskGroupsShowView
