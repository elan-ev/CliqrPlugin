import Backbone from 'backbone'
import Voting from './voting'

const VotingsCollection = Backbone.Collection.extend({
    model: Voting,

    initialize() {},

    url() {
        return window.cliqr.config.PLUGIN_URL + 'votings?cid=' + window.cliqr.config.CID
    },

    comparator: 'start'
})

export default VotingsCollection
