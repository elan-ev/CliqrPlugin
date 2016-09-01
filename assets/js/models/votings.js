import Backbone from 'backbone'

import Voting from './voting'

const VotingsCollection = Backbone.Collection.extend({

    model: Voting,

    url() {
        return window.cliqr.config.PLUGIN_URL + 'votings?cid=' + window.cliqr.config.CID
    },

    comparator: 'id'
})

export default VotingsCollection
