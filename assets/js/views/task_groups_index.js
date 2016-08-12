import Backbone from 'backbone'
import _ from 'underscore'

import utils from '../utils'

const TaskGroupsIndexView = Backbone.View.extend({

    className: 'page',
    id: 'task-groups-index',

    events: {
    },

    render() {
        const template = require('../../hbs/task-groups-index.hbs')
        const data = {
            taskGroups: this.collection.map((tg) => {
                return {
                    ...tg.toJSON(),
                    tasks_count: tg.get('tasks').length
                }})
        }
        this.$el.html(template(data))
        return this
    }
})

export default TaskGroupsIndexView
