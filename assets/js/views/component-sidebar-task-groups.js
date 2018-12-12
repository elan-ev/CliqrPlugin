import template from '../../hbs/sidebar/widget-task-groups.hbs'
import { userRole } from '../utils'
import WidgetTaskGroupsItem from './component-sidebar-task-groups-item'
import Viewmaster from './viewmaster'

const WidgetTaskGroups = Viewmaster.extend({
    initialize({ store }) {
        Viewmaster.prototype.initialize.call(this)

        if (userRole('lecturer')) {
            this.listenTo(this.collection, 'add', this.onTaskGroupAdded)
            this.collection.each(item => this.appendItem(item))
        }

        this.listenTo(store, 'navigation', this.onNavigation)
    },

    template,

    onTaskGroupAdded(model) {
        this.appendItem(model)
    },

    onNavigation(item, taskGroup = null) {
        this.$('li.active, a.active').removeClass('active')

        switch (item) {
            case 'task-groups':
                this.$('.sidebar-navigation > li:first-child').addClass('active')
                break

            case 'archive':
                this.$('.sidebar-navigation > li:last-child').addClass('active')
                break

            case 'task-group':
                taskGroup && taskGroup.trigger('select')
                break
        }
    },

    appendItem(model) {
        this.appendView('.cliqr--navigation-task-groups', new WidgetTaskGroupsItem({ model }))
        this.refreshViews()
    }
})

export default WidgetTaskGroups
