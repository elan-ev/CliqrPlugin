import Backbone from 'backbone'
import TaskGroup from './task_group'

const TaskGroupsCollection = Backbone.Collection.extend({
    model: TaskGroup,

    url() {
        return window.cliqr.config.PLUGIN_URL + 'task_groups?cid=' + window.cliqr.config.CID
    },

    comparator() {
        return parseInt(this.id, 10)
    }
})

export default TaskGroupsCollection
