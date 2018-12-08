import TaskGroupsCollection from '../models/task_groups'

const taskGroups = new TaskGroupsCollection()

if (window.cliqr.bootstrap.taskGroups) {
    taskGroups.reset(window.cliqr.bootstrap.taskGroups)
    delete(window.cliqr.bootstrap.taskGroups)
} else {
    taskGroups.fetch()
}

export default taskGroups
