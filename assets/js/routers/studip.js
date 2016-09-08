import Backbone from 'backbone'
import _ from 'underscore'
import utils from '../utils'
import Promise from 'bluebird'

import TaskGroup from '../models/task_group'
import TaskGroupsCollection from '../models/task_groups'

import Task from '../models/task'
import TasksCollection from '../models/tasks'

import Voting from '../models/voting'

import TaskGroupsIndexView from '../views/task_groups_index'
import TaskGroupsShowView from '../views/task_groups_show'
import TasksShowView from '../views/tasks_show'
import VotingsShowView from '../views/votings_show'
import VotingsCompareView from '../views/votings_compare'


import { Schema, arrayOf, normalize, unionOf, valuesOf } from 'normalizr'

// instantiate then remove bootstrapped
const bootstrapTaskGroups = function () {
    const taskGroups = new TaskGroupsCollection(cliqr.bootstrap.taskGroups)
    delete(cliqr.bootstrap.taskGroups)
    return taskGroups
}

// instantiate then remove bootstrapped
const bootstrapTasks = function () {
    const taskGroups = bootstrapTaskGroups()
    const tasks = _.flatten(_.filter(taskGroups.pluck('tasks')))
    return new TasksCollection(tasks)
}

const fetchTaskGroups = function () {
    if (cliqr.bootstrap.taskGroups) {
        return Promise.resolve(bootstrapTaskGroups())
    }

    const taskGroups = new TaskGroupsCollection()
    return taskGroups.fetch()
        .then((...args) => { console.log(args); return taskGroups })
        .catch((...args) => { console.log("caught: ", args) })
}

const fetchTaskGroup = function (id) {
    let taskGroup
    if (cliqr.bootstrap.taskGroups) {
        taskGroup = bootstrapTaskGroups().get(id)
        if (taskGroup) {
            return Promise.resolve(taskGroup)
        }
    }

    taskGroup = new TaskGroup({ id })
    return taskGroup.fetch()
        .then( () => { return taskGroup })
        .catch((...args) => { console.log("caught: ", args) })
}

const fetchVoting = function (id) {
    const voting = new Voting({ id })
    return voting.fetch()
        .then( () => { return voting })
}

const fetchTwoVotings = function (ids) {
    return Promise.resolve(
        _.times(2, (i) => _.tap(new Voting({ id: ids[i] }), (v) => v.fetch()) )
    )
}

const fetchTask = function (id) {
    let task
    if (cliqr.bootstrap.taskGroups) {
        task = bootstrapTasks().get(id)
        if (task) {
            return Promise.resolve(task)
        }
    }

    task = new Task({ id })
    return task.fetch().then( () => { return task }) // TODO (mlunzena) #then should be #then
}

const QuestionsRouter = Backbone.Router.extend({

    routes: {
        '': 'taskGroups',

        'task-groups': 'taskGroups',
        'task-groups-:id': 'taskGroup',

        'task-:id': 'task',

        'compare/:v1/:v2': 'votingCompare',

        'voting/:id': 'voting'

    },

    routeHandler(fetcher, id, view, useCollection = 'model') {
        this.showLoading()
        fetcher(id)
            .then((response) => {
                this.hideLoading()
                return utils.changeToPage(new view({ [useCollection]: response }))
            })
    },

    initialize(options) {

        if (cliqr.bootstrap.taskGroups) {

            const taskGroupSchema = new Schema('task_group')
            const testSchema = new Schema('test')
            const taskSchema = new Schema('task')
            const assignmentSchema = new Schema('assignment')
            taskSchema.define({
                assignments: arrayOf(assignmentSchema)
            })
            testSchema.define({
                tasks: arrayOf(taskSchema)
            })
            taskGroupSchema.define({
                test: testSchema
            });
            const response = normalize(cliqr.bootstrap.taskGroups, arrayOf(taskGroupSchema));
            console.log("normalizred", response)
        }
    },

    // ROUTE: '' and '#task-groups'
    taskGroups() { this.routeHandler(fetchTaskGroups, null, TaskGroupsIndexView, 'collection') },

    // ROUTE: '#task-groups-:id'
    taskGroup(id) { this.routeHandler(fetchTaskGroup, id, TaskGroupsShowView) },

    // ROUTE: '#task-:id'
    task(id) { this.routeHandler(fetchTask, id, TasksShowView) },

    // ROUTE: '#voting/:id'
    voting(id) { this.routeHandler(fetchVoting, id, VotingsShowView) },

    // ROUTE: #compare/:v1/:v2
    votingCompare(v1, v2) { this.routeHandler(fetchTwoVotings, [v1, v2], VotingsCompareView, 'votings') },

    // Loader stuff - TODO should not be here, AppView?

    loader: false,
    timeout: false,

    showLoading() {
        this.timeout = setTimeout( () => {
            this.loader = Backbone.$('<span class="cliqr-loader"/>').html('Loading...').prependTo('#layout_content')
        }, 300)
    },

    hideLoading() {
        clearTimeout(this.timeout)
        if (this.loader) {
            this.loader.remove()
        }
    }
})

export default QuestionsRouter
