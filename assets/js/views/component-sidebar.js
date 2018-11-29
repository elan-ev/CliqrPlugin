import Viewmaster from './viewmaster'
import WidgetOnAir from './component-sidebar-onair'

const SidebarView = Viewmaster.extend({
    initialize() {
        Viewmaster.prototype.initialize.call(this)

        const content = this.$el.html()
        this.template = function() {
            return content
        }

        this.appendView('section.sidebar', WidgetOnAir)
    }
})

export default SidebarView
