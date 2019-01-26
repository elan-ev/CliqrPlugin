import Backbone from 'backbone'
import taskGroups from './task_groups'

const store = Object.create(Backbone.Events)

store.taskGroups = taskGroups

export default store
