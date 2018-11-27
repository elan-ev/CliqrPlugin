import '@babel/polyfill'
import './public-path.js'
import Backbone from 'backbone'
import jQuery from 'jquery'

import showError from './error'
import setupHandlebars from './setupHandlebars.js'

import PollsCollection from './models/polls'
import PollsIndexView from './views/polls_index'

// instantiate then remove bootstrapped
const bootstrapPolls = function() {
    const polls = new PollsCollection(window.cliqr.bootstrap.polls || [])
    delete window.cliqr.bootstrap.polls
    return polls
}

const fetchPolls = function() {
    if (window.cliqr.bootstrap.polls) {
        return Promise.resolve(bootstrapPolls())
    }

    const polls = new PollsCollection()
    return polls.fetch().then(() => polls)
}

class PollCliqrApp {
    constructor(selector) {
        this.selector = selector
        setupHandlebars()
        this.initBackbone()
        this.initPage()
    }

    initBackbone() {
        Backbone.$ = jQuery

        Backbone.ajax = function() {
            const xhr = Backbone.$.ajax.apply(Backbone.$, arguments)
            return Promise.resolve(xhr)
        }
    }

    initPage() {
        fetchPolls()
            .then(collection => {
                const page = new PollsIndexView({ collection })
                page.$el.appendTo(Backbone.$(this.selector))
                page.render()
                page.postRender()
            })
            .catch((...args) => {
                showError('Die Abstimmung konnte nicht geladen werden.', args)
            })
    }
}

const app = new PollCliqrApp('#cliqr-poll-container')
