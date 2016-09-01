import Backbone from 'backbone'
import _ from 'underscore'

import taskTypes from '../models/task_types'


const decorateModel = function (model) {
    return {
        STUDIP: window.STUDIP,
        $mode: this.$mode,
        taskTypes: taskTypes.map((t) => {
            const instance = new (t.get('class'))
            return { id: t.id, name: instance.name, icn: instance.icon, selected: t.id === this.$selectedType }
        })
    }
}

const TasksAddView = Backbone.View.extend({

    tagName: 'div',

    className: 'tasks-add',

    $mode: 'button',
    $creatorViews: null,
    $selectedType: null,

    events: {
        'click .js-show-chooser': 'onClickShowChooser',
        'click .js-add-question': 'onClickAddQuestion'
    },

    initialize() {
        //this.interval = setInterval( () => this.model.fetch(), 2000)
        this.reset()
    },

    reset() {
        this.$mode = 'button'
        this.$creatorViews = {}
        this.$selectedType = null
    },

    removeCreatorViews() {
        _.invoke(this.$creatorViews, 'remove')
    },

    remove() {
        //clearInterval(this.interval)
        this.removeCreatorViews()
        Backbone.View.prototype.remove.call(this)
    },

    render() {
        const template = require('../../hbs/tasks-add.hbs')
        this.$el.html(template(decorateModel.call(this, [this.model])))
        this.renderCreatorViews()
        return this
    },

    renderCreatorViews() {
        if (this.$selectedType) {
            const selectedView = this.$creatorViews[this.$selectedType]
            _.each(this.$creatorViews, (view, id) => view.$el.hide())
            if (selectedView) {
                this.$('main').append(selectedView.render().$el.show())
            }
        }
    },

    selectTypeCreator(id) {
        if (!this.$creatorViews[id]) {
            const type = taskTypes.getTaskType(id)
            this.$creatorViews[id] = type.getCreateView(this.model)
        }

        if (this.$selectedType !== id) {
            this.$selectedType = id
            this.render()
        }
    },

    onClickShowChooser(event) {
        event.preventDefault()
        this.$mode = 'form'
        this.render()
    },

    onClickAddQuestion(event) {
        event.preventDefault()
        const id = Backbone.$(event.target).closest('.js-add-question').data('typeid')
        this.selectTypeCreator(id)
    }
})

export default TasksAddView
