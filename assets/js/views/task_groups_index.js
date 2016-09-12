import Backbone from 'backbone'
import _ from 'underscore'

import utils from '../utils'

const TaskGroupsIndexView = Backbone.View.extend({

    className: 'page',
    id: 'task-groups-index',
    $mode: 'button',

    events: {
        'click .js-add-task-group': 'onClickAddTaskGroup',
        'submit form.cliqr--add-task-group-form': 'onSubmitForm',
        'click .js-export': 'onClickExport',
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
                }}),
            $mode: this.$mode
        }
        this.$el.html(template(data))
        return this
    },

    onClickAddTaskGroup(event) {
        event.preventDefault()

        this.$mode = 'form'
        this.render()
    },

    onSubmitForm(event) {
        event.preventDefault()
        const $formData = Backbone.$(event.target.closest('form')).serializeArray(),
              formData = _.reduce($formData, (memo, item) => _.tap(memo, (memo) => memo[item.name] = item.value), {})

        const newTaskGroup = this.collection.create(formData)
    },

    onClickRemove(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('tr').data('taskgroupid')

        this.collection.get(id).destroy()
            .then((...args) => console.log("destroyed task group:", args))
            .catch((e) => console.log("error on destroying task group: ", e))
    },

    onClickExport(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('tr').data('taskgroupid'),
              taskGroup = this.collection.get(id)
        console.log(`exporting task group ${id}`, taskGroup)
        const wndHandle = window.open(taskGroup.exportURL())
    }
})

export default TaskGroupsIndexView
