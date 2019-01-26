import { CollectionView } from 'backbone.marionette'
import template from '../hbs/assignment-statements.hbs'
import StatementView from './assignment-statement'

export default CollectionView.extend({
    template,

    initialize({ voting }) {
        this.voting = voting
    },

    childView: StatementView,
    childViewContainer: '.cliqr--scales-statements',
    childViewOptions() {
        return { voting: this.voting }
    }
})
