import { CollectionView } from 'backbone.marionette';
import template from '../hbs/show-statements.hbs';
import StatementView from './show-statement.js';

export default CollectionView.extend({
    template,

    childView: StatementView,
    childViewContainer: '.cliqr--scales-statements',
});