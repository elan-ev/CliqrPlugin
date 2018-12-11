import template from '../../hbs/sidebar/widget-task-groups-item.hbs'
import Viewmaster from './viewmaster'

const WidgetTaskGroupsItem = Viewmaster.extend({
    tagName: 'li',

    // TODO: class: "active" missing
    className: 'cliqr--navigation-task-group',

    events: {},

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'remove', () => this.remove())
    },

    template,

    context() {
        return {
            id: this.model.id,
            text: this.model.get('title'),
            active: this.model.get('active') // TODO: ???
        }
    }
})

export default WidgetTaskGroupsItem
