import Backbone from 'backbone'
import Task from './task'

const TasksCollection = Backbone.Collection.extend({
    model: Task,

    url() {
        return window.cliqr.config.PLUGIN_URL + 'tasks?cid=' + window.cliqr.config.CID
    }
})

export default TasksCollection
