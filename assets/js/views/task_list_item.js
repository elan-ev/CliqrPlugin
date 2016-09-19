import Backbone from 'backbone'

import Voting from '../models/voting'

const decorateTaskListItem = function (model) {

    const votings = model.getVotings()

    return {
        ...model.toJSON(),
        votings_count: votings.length,
        last_voting: votings.length ? votings.last().toJSON() : null,
        state: model.getCurrentState(),
        $mode: 'show'
    }
}

const TaskListItemView = Backbone.View.extend({

    tagName: 'li',

    className: 'cliqr--task-list-item',

    events: {
        'click .js-start': 'onClickStart',
        'click .js-remove': 'onClickRemove'
    },

    initialize() {
        this.listenTo(this.model, 'change', this.render)
    },

    remove() {
        Backbone.View.prototype.remove.call(this)
    },

    render() {
        const template = require('../../hbs/task-list-item.hbs')
        this.$el.html(template(decorateTaskListItem(this.model)))
        return this
    },

    onClickRemove(event) {
        event.preventDefault()
        this.model.destroy()
        this.remove()
    },

    onClickStart(event) {
        event.preventDefault()
        const vtng = new Voting({ task_id: this.model.id })
        vtng.save()
            .then((model) => {
                const id = model.id
                Backbone.history.navigate(`voting/${id}`, { trigger: true })
                return null
            })
    }
})

export default TaskListItemView
