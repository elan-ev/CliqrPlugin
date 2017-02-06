import Backbone from 'backbone'

import { userRole, activateNavigation, showLoading, hideLoading, changeToPage } from '../utils'

import ArchiveView from '../views/archive'
import TaskGroupsEditView from '../views/task_groups_edit'
import TaskGroupsIndexView from '../views/task_groups_index'
import TaskGroupsShowView from '../views/task_groups_show'
import TasksCreateView from '../views/tasks_create'
import TasksEditView from '../views/tasks_edit'
import TasksShowView from '../views/tasks_show'
import VotingsCompareView from '../views/votings_compare'
import VotingsShowView from '../views/votings_show'

import { fetchTaskGroups, fetchTaskGroup, fetchTask, fetchVoting, fetchTwoVotings, fetchLastVotings } from './studip-fetcher'

const StudipRouter = Backbone.Router.extend({

    initialize(options) {
        this.selector = options.selector
    },

    routes: {
        '': 'redirectByAuthorization',

        'task-groups': 'taskGroups',
        'task-groups/show/:id': 'taskGroup',
        'task-group/edit/:id': 'taskGroupEdit',

        'task/show/:id': 'task',
        'task/create/:id': 'taskCreate',
        'task/edit/:id': 'taskEdit',

        'compare/:v1/:v2': 'votingCompare',

        'voting/:id': 'voting',

        'archive': 'archive'
    },

    routeHandler(fetcher, id, view, useCollection = 'model', ...rest) {
        showLoading()
        return fetcher(id)
            .then(response => {
                hideLoading()
                activateNavigation(...rest)
                return changeToPage(new view({ [useCollection]: response }), this.selector)
            })
            .catch(error => {
                const status = error && error.status
                if (status === 403) {
                    hideLoading()
                    return this.navigate('', { trigger: true, replace: true })
                }
                throw error
            })
    },

    // ROUTE: ''
    redirectByAuthorization() {

        if (userRole('student')) {
            this.navigate('archive', { trigger: true, replace: true })
        }

        else {
            if (window.cliqr.bootstrap.taskGroups.length === 1) {
                this.navigate(`task-groups/show/${window.cliqr.bootstrap.taskGroups[0].id}`, { trigger: true, replace: true })
            } else {
                this.navigate('task-groups', { trigger: true, replace: true })
            }
        }
    },

    // ROUTE: '#task-groups'
    taskGroups() { this.routeHandler(fetchTaskGroups, null, TaskGroupsIndexView, 'collection') },

    // ROUTE: '#task-groups/show/:id'
    taskGroup(id) { this.routeHandler(fetchTaskGroup, id, TaskGroupsShowView) },

    // ROUTE: '#task-group/edit/:id'
    taskGroupEdit(id) { this.routeHandler(fetchTaskGroup, id, TaskGroupsEditView) },

    // ROUTE: '#task/show/:id'
    task(id) { this.routeHandler(fetchTask, id, TasksShowView) },

    // ROUTE: '#task/create/:id'
    taskCreate(id) { this.routeHandler(fetchTaskGroup, id, TasksCreateView) },

    // ROUTE: '#task/edit/:id'
    taskEdit(id) { this.routeHandler(fetchTask, id, TasksEditView) },

    // ROUTE: '#voting/:id'
    voting(id) { this.routeHandler(fetchVoting, id, VotingsShowView) },

    // ROUTE: '#compare/:v1/:v2'
    votingCompare(v1, v2) { this.routeHandler(fetchTwoVotings, [ v1, v2 ], VotingsCompareView, 'votings') },

    // ROUTE: '#archive'
    archive() { this.routeHandler(fetchLastVotings, null, ArchiveView, 'collection', '#nav_cliqr_archive') }
})

export default StudipRouter
