import { View } from 'backbone.marionette'
import listItemTemplate from './list-item.hbs'

export default View.extend({
    tagName: 'tr',
    template: listItemTemplate,

    ui: {
        export: '.js-export',
        duplicate: '.js-duplicate',
        remove: '.js-remove'
    },

    triggers: {
        'click @ui.export': 'export:taskgroup',
        'click @ui.duplicate': 'duplicate:taskgroup',
        'click @ui.remove': 'remove:taskgroup'
    },

    modelEvents: {
        change: 'render'
    }
})
