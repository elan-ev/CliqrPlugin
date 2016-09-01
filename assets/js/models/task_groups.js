import Backbone from 'backbone'
import _ from 'underscore'

import TaskGroup from './task_group'

const TaskGroupsCollection = Backbone.Collection.extend({

    model: TaskGroup,

    url() {
        return cliqr.config.PLUGIN_URL + 'task_groups?cid=' + cliqr.config.CID
    },

    comparator: 'id'
})

export default TaskGroupsCollection
