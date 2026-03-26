import Backbone from 'backbone';
import TaskGroup from './task_group.js';

const TaskGroupsCollection = Backbone.Collection.extend({
    model: TaskGroup,

    url() {
        return window.cliqr.config.PLUGIN_URL + 'task_groups?cid=' + window.cliqr.config.CID;
    },

    comparator(model) {
        return parseInt(model.id, 10);
    },
});

export default TaskGroupsCollection;