import { View } from 'backbone.marionette'
import template from './task-groups-item.hbs'

const WidgetTaskGroupsItem = View.extend({
    tagName: 'li',

    className: 'cliqr--navigation-task-group',

    modelEvents: {
        select() {
            this.$el.addClass('active')
        },
        change: 'render'
    },

    template
})

export default WidgetTaskGroupsItem
