import Backbone from 'backbone'
import _ from 'underscore'
import { changeToPage } from '../utils'

import VotingsCollection from '../models/votings'

import PollsIndexView from '../views/polls_index'

// instantiate then remove bootstrapped
const bootstrapPolls = function () {
    const polls = new VotingsCollection(window.cliqr.bootstrap.polls || [])
    delete(window.cliqr.bootstrap.polls)
    return polls
}

const fetchPolls = function () {
    if (window.cliqr.bootstrap.polls) {
        return Promise.resolve(bootstrapPolls())
    }

    const polls = new VotingsCollection()
    return polls.fetch()
        .then((...args) => polls )
        .catch((...args) => { console.log("caught: ", args); return args })
}



const PollsRouter = Backbone.Router.extend({

    routes: {
        '': 'polls',
        'polls': 'polls'
    },

    initialize(options) {
        this.selector = options.selector
    },

    routeHandler(fetcher, id, view, useCollection = false) {
        this.showLoading()
        fetcher(id)
            .then(response => {
                this.hideLoading()
                const page = new view(useCollection ? { collection: response } : { model: response })
                changeToPage(page, this.selector)
            })
            .catch(error => {
                console.log('Caught an error', error)
                // TODO
            })
    },

    // ROUTE: ''
    // ROUTE: '#polls'
    polls() { this.routeHandler(fetchPolls, null, PollsIndexView, true) },

    // Loader stuff - TODO should not be here, AppView?

    loader: false,
    timeout: false,

    showLoading() {
        this.timeout = setTimeout( () => {
            this.loader = Backbone.$('<span class="cliqr-loader"/>').html('Loading...').prependTo('#layout_content')
        }, 300)
    },

    hideLoading() {
        clearTimeout(this.timeout)
        if (this.loader) {
            this.loader.remove()
        }
    }
})

export default PollsRouter
