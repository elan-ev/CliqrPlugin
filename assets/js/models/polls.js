import Backbone from 'backbone'

import Voting from './voting'
import IDList from './id_list'

const PollsCollection = Backbone.Collection.extend({

    model: Voting,

    initialize() {
        this.id_list = new IDList()
        this.listenTo(this, 'add:response', this.onAddResponse)
    },

    url() {
        return window.cliqr.config.PLUGIN_URL + 'polls/' + window.cliqr.config.CID
    },

    comparator: 'start',

    firstFresh() {
        return this.find(model => model.get('is_running') && !this.id_list.test(model))
    },

    onAddResponse(model, response) {
        if (!this.id_list.test(model)) {
            this.id_list.add(model)
        }
    }
})

export default PollsCollection
