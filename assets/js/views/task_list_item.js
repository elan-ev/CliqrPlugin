import Backbone from 'backbone'
import showError from '../error'
import Viewmaster from './viewmaster'
import { showConfirmDialog } from '../dialog'
import task_types from '../models/task_types'

const TaskListItemView = Viewmaster.extend({

    attributes() {
        return {
            'data-taskid': this.model.id
        }
    },

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
        const icon = task_types.get(this.model.get('type')).get('icon')

        return {
            ...this.model.toJSON(),
            icon,
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
                    .catch(error => {
                        showError('Could not remove task group', error)
                    })
            }
        )
    },

    onClickStart(event) {
        event.preventDefault()
        this.model.startVoting()
            .then(voting => {
                Backbone.history.navigate(`voting/${voting.id}`, { trigger: true })
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
