import _ from 'underscore'

import Task from '../models/task'
import TaskGroup from '../models/task_group'
import TaskGroupsCollection from '../models/task_groups'
import TasksCollection from '../models/tasks'
import Voting from '../models/voting'
import VotingsCollection from '../models/votings'

// instantiate then remove bootstrapped
const bootstrapTaskGroups = function () {
    const taskGroups = new TaskGroupsCollection(window.cliqr.bootstrap.taskGroups)
    delete(window.cliqr.bootstrap.taskGroups)
    return taskGroups
}

// instantiate then remove bootstrapped
const bootstrapTasks = function () {
    const taskGroups = bootstrapTaskGroups()
    const tasks = _.flatten(_.filter(taskGroups.pluck('tasks')))
    return new TasksCollection(tasks)
}

const bootstrapLastVotings = function () {
    const lastVotings = new VotingsCollection(window.cliqr.bootstrap.lastVotings || [])
    delete(window.cliqr.bootstrap.lastVotings)
    return lastVotings
}

export const fetchTaskGroups = function () {
    if (window.cliqr.bootstrap.taskGroups) {
        return Promise.resolve(bootstrapTaskGroups())
    }

    const taskGroups = new TaskGroupsCollection()
    return taskGroups.fetch()
        .then(() => taskGroups)
}

export const fetchTaskGroup = function (id) {
    let taskGroup
    if (window.cliqr.bootstrap.taskGroups) {
        taskGroup = bootstrapTaskGroups().get(id)
        if (taskGroup) {
            return Promise.resolve(taskGroup)
        }
    }

    taskGroup = new TaskGroup({ id })
    return taskGroup.fetch()
        .then( () => taskGroup )
}

export const fetchVoting = function (id) {
    const voting = new Voting({ id })
    return voting.fetch()
        .then( () => voting )
}

export const fetchTwoVotings = function ([ id1, id2 ]) {
    return Promise.resolve( [ new Voting({ id: id1 }), new Voting({ id: id2 }) ] )
}

export const fetchTask = function (id) {
    let task
    if (window.cliqr.bootstrap.taskGroups) {
        task = bootstrapTasks().get(id)
        if (task) {
            return Promise.resolve(task)
        }
    }

    task = new Task({ id })
    return task.fetch().then( () => task )
}

export const fetchLastVotings = function () {
    if (window.cliqr.bootstrap.lastVotings) {
        return Promise.resolve(bootstrapLastVotings())
    }

    const lastVotings = new VotingsCollection()
    return lastVotings.fetch()
        .then(() => lastVotings)
}
