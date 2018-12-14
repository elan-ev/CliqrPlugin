import { View } from 'backbone.marionette'
import listItemTemplate from './list-item.hbs'

export default View.extend({
    tagName: 'tr',

    template: listItemTemplate,

    templateContext() {
        return {
            task: this.model.getTask().toJSON(),
            responses_count: this.model.get('responses').length
        }
    },

    ui: {
        remove: '.js-remove'
    },

    triggers: {
        'click @ui.remove': 'remove:voting'
    },

    modelEvents: {
        change: 'render'
    }
})
