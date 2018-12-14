import { CollectionView } from 'backbone.marionette'
import statementsTemplate from '../hbs/form-statements.hbs'
import StatementView from './form-statement'

export default CollectionView.extend({
    tagName: 'label',
    className: 'cliqr--scales-statements',
    template: statementsTemplate,

    childView: StatementView,
    childViewContainer: '.choices',
    childViewEventPrefix: 'childview',

    ui: {
        add: '.js-add'
    },

    triggers: {
        'click @ui.add': 'add:statement'
    },

    collectionEvents: {
        remove: 'render'
    },

    onAddStatement(view, event) {
        this.collection.add({
            text: ''
        })
    },

    onChildviewRemoveStatement({ model }, event) {
        this.collection.remove(model)
    }
})
