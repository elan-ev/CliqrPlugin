import Backbone from 'backbone'

import showError from '../error'
import Viewmaster from './viewmaster'
import { showConfirmDialog, showDialog } from '../dialog'
import TaskGroupsCreateView from './task_groups_create'
import TaskGroupsImportView from './task_groups_import'

const TaskGroupsIndexView = Viewmaster.extend({

    className: 'cliqr--task-groups-index',

    events: {
        'click .js-add-task-group': 'onClickAddTaskGroup',
        'click .js-import-task-group': 'onClickImportTaskGroup',

        'click .js-export': 'onClickExport',
        'click .js-duplicate': 'onClickDuplicate',
        'click .js-remove': 'onClickRemove'
    },

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        this.listenTo(this.collection, 'change', this.render)
        this.listenTo(this.collection, 'update', this.render)
    },

    template: require('../../hbs/task-groups-index.hbs'),


    context() {
        return {
            taskGroups: this.collection.toJSON()
        }
    },

    onClickAddTaskGroup(event) {
        event.preventDefault()
        const createDialog = new TaskGroupsCreateView({ collection: this.collection })
        showDialog(createDialog.render(), { title: 'Fragensammlung erstellen' })
            .then(closer => createDialog.once('cancel', closer))
            .catch(error => {
                showError('Could not create task group', error)
            })
    },

    onClickImportTaskGroup(event) {
        event.preventDefault()

        const importDialog = new TaskGroupsImportView({ collection: this.collection })
        showDialog(importDialog.render(), { title: 'Fragensammlung importieren' })
            .then(closer => importDialog.once('cancel', closer))
            .catch(error => {
                showError('Could not import task group', error)
            })
    },

    onClickRemove(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('tr').data('taskgroupid'),
              taskGroup = this.collection.get(id)

        showConfirmDialog(
            `Wollen Sie die Fragensammlung "${taskGroup.get('title')}" wirklich löschen?`,
            () => {
                taskGroup.destroy()
                    .catch(error => {
                        showError('Could not remove task group', error)
                    })
            }
        )
    },

    onClickDuplicate(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('tr').data('taskgroupid')

        this.collection.get(id).duplicate()
            .then(taskGroup => {
                this.collection.add(taskGroup)
                return null
            })
            .catch(error => {
                showError('Could not duplicate task group', error)
            })
    },

    onClickExport(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('tr').data('taskgroupid'),
              taskGroup = this.collection.get(id)
        window.open(taskGroup.exportURL())
    }
})

export default TaskGroupsIndexView
