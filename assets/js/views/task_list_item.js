import Backbone from 'backbone'
import { showConfirmDialog } from '../dialog'
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
        'click .js-duplicate': 'onClickDuplicate',
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
        showConfirmDialog(
            `Wollen Sie diese Frage wirklich löschen?`,
            () => {
                this.model.destroy()
                    .then((...args) => {
                        this.remove()
                        return null
                    })
                    .catch((e) => {
                        console.log("error on destroying task group: ", e)
                        return null
                    })
            }
        )
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
    },

    onClickDuplicate(event) {
        event.preventDefault()
        this.model.duplicate()
            .then((task) => {
                this.model.collection.once('add', () => this.$el.nextAll().last()[0].scrollIntoView())
                this.model.collection.add(task)
                return null
            })
    }
})

export default TaskListItemView
