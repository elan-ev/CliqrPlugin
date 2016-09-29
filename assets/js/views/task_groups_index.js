import Backbone from 'backbone'
import _ from 'underscore'
import { showConfirmDialog, showDialog } from '../dialog'
import TaskGroupsCreateView from './task_groups_create'
import TaskGroupsImportView from './task_groups_import'

const TaskGroupsIndexView = Backbone.View.extend({

    className: 'cliqr--task-groups-index',

    events: {
        'click .js-add-task-group': 'onClickAddTaskGroup',
        'click .js-import-task-group': 'onClickImportTaskGroup',

        'click .js-export': 'onClickExport',
        'click .js-duplicate': 'onClickDuplicate',
        'click .js-remove': 'onClickRemove'
    },

    initialize(options) {
        this.listenTo(this.collection, 'change', this.render)
        this.listenTo(this.collection, 'update', this.render)
    },

    render() {
        const template = require('../../hbs/task-groups-index.hbs')
        //this.collection.sort()
        const data = {
            taskGroups: this.collection.map((tg) => {
                const test = tg.get('test')
                return {
                    ...tg.toJSON(),
                    tasks_count: test && test.tasks ? test.tasks.length : 0
                }})
        }
        this.$el.html(template(data))
        return this
    },

    onClickAddTaskGroup(event) {
        event.preventDefault()
        const createDialog = new TaskGroupsCreateView({ collection: this.collection })
        showDialog(createDialog.render(), { title: 'Fragensammlung erstellen' })
            .then((closer) => createDialog.once('cancel', closer))
    },

    onClickImportTaskGroup(event) {
        event.preventDefault()

        const importDialog = new TaskGroupsImportView({ collection: this.collection })
        showDialog(importDialog.render(), { title: 'Fragensammlung importieren' })
            .then((closer) => importDialog.once('cancel', closer))
    },

    onClickRemove(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('tr').data('taskgroupid'),
              taskGroup = this.collection.get(id)

        showConfirmDialog(
            `Wollen Sie die Fragensammlung "${taskGroup.get('title')}" wirklich löschen?`,
            () => {
                taskGroup.destroy()
                    .catch((e) => {
                        console.log("error on destroying task group: ", e)
                        return null
                    })
            }
        )
    },

    onClickDuplicate(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('tr').data('taskgroupid')

        this.collection.get(id).duplicate()
            .then((taskGroup) => {
                // this.collection.once('add', () => this.$el.nextAll().last()[0].scrollIntoView())
                this.collection.add(taskGroup)
                return null
            })
    },

    onClickExport(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('tr').data('taskgroupid'),
              taskGroup = this.collection.get(id)
        const wndHandle = window.open(taskGroup.exportURL())
    }
})

export default TaskGroupsIndexView
