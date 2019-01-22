import { CollectionView, View } from 'backbone.marionette'
import template from '../hbs/form-statements.hbs'
import StatementView from './form-statement'

export default CollectionView.extend({
    tagName: 'label',
    className: 'cliqr--scales-statements',
    template,

    childView: StatementView,
    childViewContainer: '.statements',

    childViewTriggers: {
        'remove:statement': 'remove:statement'
    },

    ui: {
        addStatement: '.js-add'
    },

    triggers: {
        'click @ui.addStatement': 'add:statement'
    }
})
