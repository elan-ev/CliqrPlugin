import Viewmaster from './viewmaster'
import PollsCollection from '../models/polls'
import task_types from '../models/task_types'
import pubsub from '../message_bus'
import template from '../../hbs/sidebar/widget-onair.hbs'

const WidgetOnAir = Viewmaster.extend({
    initialize() {
        Viewmaster.prototype.initialize.call(this)

        const restartTimeout = () => {
            if (this.timeout) {
                clearTimeout(this.timeout)
            }
            this.timeout = setTimeout(() => this.collection.fetch(), 5000)
        }

        this.collection = new PollsCollection()
        this.listenTo(this.collection, 'add remove', this.render)

        this.listenTo(this.collection, 'sync', restartTimeout)
        this.collection.fetch()

        this.listenTo(pubsub, 'start:voting', voting => {
            // TODO: verify
            this.collection.add(voting)
            restartTimeout()
        })
        this.listenTo(pubsub, 'stop:voting', voting => {
            // TODO: verify
            this.collection.remove(voting.id)
            restartTimeout()
        })
    },

    remove() {
        Viewmaster.prototype.remove.call(this)

        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    },

    context() {
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

export default WidgetOnAir
