import { View } from 'backbone.marionette'
import task_types from '../../../models/task_types'
import template from './list-item.hbs'

export default View.extend({
    tagName: 'tr',

    className: 'cliqr--task-list-item',

    ui: {
        start: '.js-start',
        stop: '.js-stop',
        duplicate: '.js-duplicate',
        remove: '.js-remove'
    },

    triggers: {
        'click @ui.start': 'start:task',
        'click @ui.stop': 'stop:task',
        'click @ui.duplicate': 'duplicate:task',
        'click @ui.remove': 'remove:task'
    },

    modelEvents: {
        change: 'render'
    },

    template,

    templateContext() {
        const votings = this.model.getVotings()
        const icon = task_types.get(this.model.get('type')).get('icon')

        return {
            icon,
            last_voting: votings.length ? votings.last().toJSON() : null,
            isActive: this.model.getCurrentState() === 'is_active'
        }
    }
})
