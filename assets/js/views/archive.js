import Backbone from 'backbone'
import _ from 'underscore'
import Viewmaster from './viewmaster'
import { showConfirmDialog } from '../dialog'
import showError from '../error'
import template from '../../hbs/archive.hbs'

const ArchiveView = Viewmaster.extend({
    tagName: 'article',

    className: 'cliqr--archive',

    events: {
        'click .js-remove': 'onClickRemove'
    },

    template,

    context() {
        return {
            votings: this.collection
                .filter(voting => !voting.isRunning())
                .reverse()
                .map(v => {
                    return {
                        ..._.omit(v.toJSON(), 'tasks'),
                        task: v.getTask().toJSON(),
                        responses_count: v.get('responses').length
                    }
                })
        }
    },

    onClickRemove(event) {
        event.preventDefault()

        const voting = this.collection.get(
            Backbone.$(event.target)
                .closest('tr')
                .data('votingid')
        )
        if (!voting) {
            return
        }

        showConfirmDialog(`Wollen Sie diese Abstimmung wirklich löschen?`, () => {
            voting
                .destroy()
                .then(() => {
                    this.render()
                    return null
                })
                .catch(error => {
                    showError('Could not remove voting', error)
                })
        })
    }
})

export default ArchiveView
