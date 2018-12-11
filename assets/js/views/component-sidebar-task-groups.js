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

            this.listenTo(store, 'select:task-group', (...args) =>
                console.log('WidgetTaskGroups select:task-group', args)
            )
        }
    },

    template,

    onTaskGroupAdded(model) {
        this.appendItem(model)
    },

    appendItem(model) {
        this.appendView('.cliqr--navigation-task-groups', new WidgetTaskGroupsItem({ model }))
        this.refreshViews()
    }
})

export default WidgetTaskGroups
