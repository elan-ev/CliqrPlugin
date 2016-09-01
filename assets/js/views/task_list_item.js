import Backbone from 'backbone'

const decorateTaskListItem = function (model) {

    const assignments = model.getAssignments()

    return {
        ...model.toJSON(),
        assignments_count: assignments.length,
        last_assignment: assignments.length ? assignments.last().toJSON() : null,
        state: model.getCurrentState(),
        $mode: 'show'
    }
}

const TaskListItemView = Backbone.View.extend({

    tagName: 'li',

    className: 'task-list-item',

    events: {
        'click .js-remove': 'onClickRemove'
    },

    initialize() {
        //this.interval = setInterval( () => this.model.fetch(), 2000)
    },

    remove() {
        //clearInterval(this.interval)
        Backbone.View.prototype.remove.call(this)
    },

    render() {
        const template = require('../../hbs/task-list-item.hbs')
        this.$el.html(template(decorateTaskListItem(this.model)))
        return this
    },

    onClickRemove(event) {
        event.preventDefault()

        console.log(this.model.collection.remove(this.model.id))
        this.model.destroy()
        this.remove()
    }
})

export default TaskListItemView
