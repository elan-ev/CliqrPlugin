import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import Radio from 'backbone.radio'
import showError from '../../../error'
import taskTypes from '../../../models/task_types'
import template from './edit.hbs'

export default View.extend({
    tagName: 'article',

    className: 'cliqr--tasks-edit',

    ui: {
        main: 'main'
    },

    regions: {
        mainRegion: '@ui.main'
    },

    initialize({ store }) {
        const taskGroup = store.taskGroups.get(this.model.get('task_group_id'))
        store.trigger('navigation', 'task-group', taskGroup)
        Radio.channel('layout').request('change:pagetitle', 'Frage bearbeiten')
    },

    template,

    templateContext() {
        return {
            breadcrumb: {
                task_group_id: this.model.get('task_group_id'),
                task_group_title: this.model.get('task_group_title'),
                task_id: this.model.id,
                task_title: this.model.get('title')
            }
        }
    },

    onRender() {
        taskTypes
            .fetchTaskType(this.model)
            .then(taskType => {
                const view = taskType.getEditView()
                this.listenTo(view, 'editTask', this.onEditTask)
                this.listenTo(view, 'cancel', this.onCancel)
                this.showChildView('mainRegion', view)
            })
            .catch(error => {
                showError('Could not fetch task type', error)
            })
    },

    onEditTask(model) {
        this.model.set(model.attributes, { silent: true })

        Radio.channel('layout').request('show:loading')

        this.model
            .save()
            .then(() => {
                Backbone.history.navigate(`task/show/${this.model.id}`, { trigger: true })
                Radio.channel('layout').request('hide:loading')
                return null
            })
            .catch(error => {
                Radio.channel('layout').request('hide:loading')
                showError('Could not edit task', error)
            })
    },

    onCancel(model) {
        Backbone.history.navigate(`task/show/${model.id}`, { trigger: true })
    }
})
