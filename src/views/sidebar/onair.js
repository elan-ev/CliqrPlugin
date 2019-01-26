import { View } from 'backbone.marionette'
import pubsub from '../../message_bus'
import PollsCollection from '../../models/polls'
import task_types from '../../models/task_types'
import template from './onair.hbs'

export default View.extend({
    collectionEvents: {
        add: 'render',
        remove: 'render',
        sync: 'restartTimeout'
    },

    initialize() {
        this.collection = new PollsCollection()
        this.collection.fetch()

        this.listenTo(pubsub, 'start:voting', voting => {
            this.collection.add(voting)
            this.restartTimeout()
        })
        this.listenTo(pubsub, 'stop:voting', voting => {
            this.collection.remove(voting.id)
            this.restartTimeout()
        })
    },

    restartTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => this.collection.fetch(), 5000)
    },

    onBeforeDestroy() {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    },

    templateContext() {
        const voting = this.collection.firstFresh()
        if (!voting) {
            return {}
        }
        const task = voting.getTask()
        const icon = task_types.get(task.get('type')).get('icon')

        return { id: 'cliqr--on-air', icon, task: task.toJSON(), voting: voting.toJSON() }
    },

    template
})
