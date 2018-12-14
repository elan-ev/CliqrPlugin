import Backbone from 'backbone'
import _ from 'underscore'
import template from './archive.hbs'
import { showConfirmDialog } from '../../dialog'
import showError from '../../error'
import { CollectionView } from 'backbone.marionette'
import ListItemView from './list-item'

export default CollectionView.extend({
    tagName: 'article',
    className: 'cliqr--archive',

    childView: ListItemView,
    childViewContainer: '.cliqr--archive-votings tbody',
    childViewOptions() {
        return { store: this.store }
    },
    childViewEventPrefix: 'childview',

    events: {
        'click .js-remove': 'onClickRemove'
    },

    initialize({ store }) {
        store.trigger('navigation', 'archive')
    },

    viewFilter(view, index, children) {
        return !view.model.isRunning()
    },

    template,

    viewComparator: 'end',

    TODOtemplateContext() {
        return {
            votings: this.collection.reverse().map(v => {
                return {
                    ..._.omit(v.toJSON(), 'tasks'),
                    task: v.getTask().toJSON(),
                    responses_count: v.get('responses').length
                }
            })
        }
    },

    onChildviewRemoveVoting(view, event) {
        event.preventDefault()

        showConfirmDialog(`Wollen Sie diese Abstimmung wirklich löschen?`, () => {
            view.model.destroy().catch(error => {
                showError('Could not remove voting', error)
            })
        })
    }
})
