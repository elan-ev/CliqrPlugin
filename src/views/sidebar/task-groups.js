import { CollectionView } from 'backbone.marionette'
import ListItemView from './task-groups-item'
import template from './task-groups.hbs'

export default CollectionView.extend({
    childView: ListItemView,
    childViewContainer: '.cliqr--navigation-task-groups',
    childViewOptions() {
        return { store: this.store }
    },
    childViewEventPrefix: 'childview',

    initialize({ store }) {
        this.listenTo(store, 'navigation', this.onNavigation)
    },

    template,

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
    }
})
