import Backbone from 'backbone'
import _ from 'underscore'
import utils from '../utils'
import Promise from 'bluebird'

import VotingsCollection from '../models/votings'

import ErrorView from '../views/error'
import PollsIndexView from '../views/polls_index'
import PollsShowView from '../views/polls_show'

// instantiate then remove bootstrapped
const bootstrapPolls = function () {
    const polls = new VotingsCollection(cliqr.bootstrap.polls || [])
    delete(cliqr.bootstrap.polls)
    return polls
}

const fetchPolls = function () {
    if (cliqr.bootstrap.polls) {
        return Promise.resolve(bootstrapPolls())
    }

    const polls = new VotingsCollection()
    return polls.fetch()
        .then((...args) => { console.log(args); return polls })
        .catch((...args) => { console.log("caught: ", args) })
}



const PollsRouter = Backbone.Router.extend({

    routes: {
        '': 'maybePolls',
        'polls': 'polls'
    },

    initialize(options) {
        this.selector = options.selector
    },

    routeHandler(fetcher, id, view, useCollection = false) {
        this.showLoading()
        fetcher(id)
            .then((response) => {
                this.hideLoading()
                const page = new view(useCollection ? { collection: response } : { model: response })
                utils.changeToPage(page, this.selector)
            })
        /*
            .catch((error, ...args) => {
                this.hideLoading()
                utils.changeToPage(new ErrorView({ error, args }))
            })
        */
    },

    // ROUTE: ''
    maybePolls() {
        this.routeHandler(fetchPolls, null, function (options) {
            if (options.collection.length === 1) {
                return new PollsShowView({ model: options.collection.first() })
            } else {
                return new PollsIndexView(options)
            }
        }, true) },

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
