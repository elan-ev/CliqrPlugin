import { View } from 'backbone.marionette'
import WidgetTaskGroups from './task-groups'
import WidgetOnAir from './onair'

export default View.extend({
    template: false,

    regions: {
        navigation: '#sidebar-navigation'
    },

    initialize({ store }) {
        this.getRegion('navigation').$el.after('<div></div')
        this.addRegion('onAirRegion', { el: '#sidebar-navigation + div', replaceElement: true })

        this.showChildView('navigation', new WidgetTaskGroups({ collection: store.taskGroups, store }))
        this.showChildView('onAirRegion', new WidgetOnAir({ store }))
    }
})
