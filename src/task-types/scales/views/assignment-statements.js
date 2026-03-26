import { CollectionView } from 'backbone.marionette';
import template from '../hbs/assignment-statements.hbs';
import StatementView from './assignment-statement.js';

export default CollectionView.extend({
    template,

    initialize({ voting, sorted }) {
        this.voting = voting;
        this.viewComparator = sorted ? sortByMean : false;
    },

    childView: StatementView,
    childViewContainer: '.cliqr--scales-statements',
    childViewOptions() {
        return { voting: this.voting };
    },
});

function sortByMean(itemA, itemB) {
    const meanA = itemA.getMean();
    const meanB = itemB.getMean();

    return meanA === meanB ? 0 : meanA < meanB ? -1 : 1;
}