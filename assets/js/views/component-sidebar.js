import Backbone from 'backbone'
import WidgetOnAir from './component-sidebar-onair'
import WidgetTaskGroups from './component-sidebar-task-groups'

const SidebarView = Backbone.View.extend({
    initialize({ store }) {
        const navigation = this.$('#sidebar-navigation')

        const widgetTaskGroups = new WidgetTaskGroups({ el: navigation, collection: store.taskGroups, store })
        widgetTaskGroups.render()

        this.$('section.sidebar').append(new WidgetOnAir().render().el)

        // this.listenTo(router, 'all', (...args) => console.log(args))
    }
})

export default SidebarView
