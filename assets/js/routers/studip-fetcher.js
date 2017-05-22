import _ from 'underscore'

import Task from '../models/task'
import TaskGroup from '../models/task_group'
import TaskGroupsCollection from '../models/task_groups'
import Voting from '../models/voting'
import VotingsCollection from '../models/votings'

// instantiate then remove bootstrapped
const bootstrapTaskGroups = function () {
    const taskGroups = new TaskGroupsCollection(window.cliqr.bootstrap.taskGroups)
    delete(window.cliqr.bootstrap.taskGroups)
    return taskGroups
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
        .then( () => taskGroups )
}

export const fetchTaskGroup = function (id) {
    const taskGroup = new TaskGroup({ id })
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
    const task = new Task({ id })
    return task.fetch()
        .then( () => task )
}

export const fetchLastVotings = function () {
    if (window.cliqr.bootstrap.lastVotings) {
        return Promise.resolve(bootstrapLastVotings())
    }

    const lastVotings = new VotingsCollection()
    return lastVotings.fetch()
        .then( () => lastVotings )
}
