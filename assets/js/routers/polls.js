import Backbone from 'backbone'
import _ from 'underscore'
import { changeToPage } from '../utils'
//import Promise from 'bluebird'

// import { Schema, arrayOf, normalize } from 'normalizr'

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

        if (cliqr.bootstrap.polls) {

            /*
            const pollSchema = new Schema('poll')
            const testSchema = new Schema('test')
            const taskSchema = new Schema('task')

            pollSchema.define({
                test: testSchema
            })
            testSchema.define({
                tasks: arrayOf(taskSchema)
            })

            const response = normalize(cliqr.bootstrap.polls, arrayOf(pollSchema));
            console.log("normalizred", response)
            */
        }
    },

    routeHandler(fetcher, id, view, useCollection = false) {
        this.showLoading()
        fetcher(id)
            .then((response) => {
                this.hideLoading()
                const page = new view(useCollection ? { collection: response } : { model: response })
                changeToPage(page, this.selector)
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
