import { CollectionView } from 'backbone.marionette'
import template from '../hbs/form-choices.hbs'
import ChoiceView from './form-choice'

export default CollectionView.extend({
    tagName: 'label',
    className: 'cliqr--mc-choices',
    template,

    childView: ChoiceView,
    childViewContainer: '.choices',
    childViewEventPrefix: 'childview',

    ui: {
        add: '.js-add'
    },

    triggers: {
        'click @ui.add': 'add:choice'
    },

    collectionEvents: {
        remove: 'render'
    },

    onAddChoice(view, event) {
        event.preventDefault()
        this.collection.add({
            text: '',
            score: 0,
            feedback: ''
        })
    },

    onChildviewRemoveChoice({ model }, event) {
        event.preventDefault()
        this.collection.remove(model)
    }
})
