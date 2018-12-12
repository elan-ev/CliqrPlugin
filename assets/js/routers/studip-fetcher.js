import Task from '../models/task'
import TaskGroup from '../models/task_group'
import Voting from '../models/voting'
import VotingsCollection from '../models/votings'
import store from '../store/index'

const bootstrapLastVotings = function() {
    const lastVotings = new VotingsCollection(window.cliqr.bootstrap.lastVotings || [])
    return lastVotings
}

export const fetchTaskGroup = function(id) {
    const taskGroup = store.taskGroups.get(id) || new TaskGroup({ id, collection: store.taskGroups })

    return taskGroup.fetch().then(() => taskGroup)
}

export const fetchVoting = function(id) {
    const voting = new Voting({ id })
    return voting.fetch().then(() => voting)
}

export const fetchTwoVotings = function([id1, id2]) {
    return Promise.resolve([new Voting({ id: id1 }), new Voting({ id: id2 })])
}

export const fetchTask = function(id) {
    const task = new Task({ id })
    return task.fetch().then(() => task)
}

export const fetchLastVotings = function() {
    if (window.cliqr.bootstrap.lastVotings) {
        return Promise.resolve(bootstrapLastVotings())
    }

    const lastVotings = new VotingsCollection()
    return lastVotings.fetch().then(() => lastVotings)
}
