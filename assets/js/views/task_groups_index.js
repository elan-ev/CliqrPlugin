import Backbone from 'backbone'
import _ from 'underscore'

import { showConfirmDialog } from '../dialog'

const TaskGroupsIndexView = Backbone.View.extend({

    className: 'cliqr--task-groups-index',

    $mode: 'button',

    events: {
        'click .js-cancel': 'onClickCancel',

        'click .js-add-task-group': 'onClickAddTaskGroup',
        'click .js-import-task-group': 'onClickImportTaskGroup',

        'click .js-export': 'onClickExport',
        'click .js-duplicate': 'onClickDuplicate',


        'submit form.cliqr--add-task-group-form': 'onSubmitForm'
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
                }}),
            $mode: this.$mode
        }
        this.$el.html(template(data))
        return this
    },

    onClickAddTaskGroup(event) {
        event.preventDefault()
        this.$mode = 'add'
        this.render()
    },

    onClickImportTaskGroup(event) {
        event.preventDefault()
        this.$mode = 'import'
        this.render()
    },

    onClickCancel(event) {
        event.preventDefault()
        this.$mode = 'button'
        this.render()
    },

    onSubmitForm(event) {
        event.preventDefault()
        const $formData = Backbone.$(event.target.closest('form')).serializeArray(),
              formData = _.reduce($formData, (memo, item) => _.tap(memo, (memo) => memo[item.name] = item.value), {})
        console.log("onSubmitForm", formData)
        const newTaskGroup = this.collection.create(formData)
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
    },

    onClickExport(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('tr').data('taskgroupid'),
              taskGroup = this.collection.get(id)
        const wndHandle = window.open(taskGroup.exportURL())
    }
})

export default TaskGroupsIndexView
