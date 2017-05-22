import Backbone from 'backbone'

import showError from '../error'
import Viewmaster from './viewmaster'
import { showConfirmDialog } from '../dialog'
import Voting from '../models/voting'

const TaskListItemView = Viewmaster.extend({

    tagName: 'tr',

    className: 'cliqr--task-list-item',

    events: {
        'click .js-start': 'onClickStart',
        'click .js-stop': 'onClickStop',
        'click .js-duplicate': 'onClickDuplicate',
        'click .js-remove': 'onClickRemove'
    },

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        this.listenTo(this.model, 'change', this.render)
    },

    template: require('../../hbs/task-list-item.hbs'),

    context() {
        const votings = this.model.getVotings()

        return {
            ...this.model.toJSON(),
            votings_count: votings.length,
            last_voting: votings.length ? votings.last().toJSON() : null,
            state: this.model.getCurrentState()
        }
    },

    onClickRemove(event) {
        event.preventDefault()
        showConfirmDialog(
            `Wollen Sie diese Frage wirklich löschen?`,
            () => {
                this.model.destroy()
                    .then(() => {
                        this.remove()
                        return null
                    })
                    .catch(e => {
                        showError('Could not remove task group', error)
                    })
            }
        )
    },

    onClickStart(event) {
        event.preventDefault()
        const vtng = new Voting({ task_id: this.model.id })
        vtng.save()
            .then(model => {
                Backbone.history.navigate(`voting/${model.id}`, { trigger: true })
                return null
            })
            .catch(error => {
                showError('Could not start voting', error)
            })
    },

    onClickStop(event) {
        event.preventDefault()

        const running = this.model.getVotings().find(a => a.isRunning())
        running.stop()
            .then(() => {
                // nothing to do
                return null
            })
            .catch(error => {
                showError('Could not stop voting', error)
            })
    },

    onClickDuplicate(event) {
        event.preventDefault()
        this.model.duplicate()
            .then(task => {
                this.model.collection.once('add', () => this.$el.nextAll().last()[0].scrollIntoView())
                this.model.collection.add(task)
                return null
            })
            .catch(error => {
                showError('Could not duplicate task', error)
            })
    }
})

export default TaskListItemView
