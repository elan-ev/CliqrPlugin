import { CollectionView } from 'backbone.marionette'
import template from '../hbs/form-choices.hbs'
import ChoiceView from './form-choice'

export default CollectionView.extend({
    tagName: 'label',
    className: 'cliqr--mc-choices',
    template,

    childView: ChoiceView,
    childViewContainer: '.choices',

    childViewTriggers: {
        'remove:choice': 'remove:choice'
    },

    ui: {
        add: '.js-add'
    },

    triggers: {
        'click @ui.add': 'add:choice'
    }
})
