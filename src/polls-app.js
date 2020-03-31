import './public-path.js'
import Backbone from 'backbone'
import { Application, MnObject } from 'backbone.marionette'
import Raven from 'raven-js'
import PollsCollection from './models/polls'
import setupHandlebars from './setupHandlebars.js'
import PollsIndexView from './views/polls/view'

const LayoutNotificationHandler = MnObject.extend({
    channelName: 'layout',

    radioRequests: {
        'apply:mathjax': 'onApplyMathjax'
    },

    onApplyMathjax($selector) {
        let mathjaxP

        if (window.MathJax && window.MathJax.Hub) {
            mathjaxP = Promise.resolve(window.MathJax)
        } else if (window.STUDIP && window.STUDIP.loadChunk) {
            mathjaxP = window.STUDIP.loadChunk('mathjax')
        }

        mathjaxP
            .then(({ Hub }) => {
                $selector.each((index, element) => Hub.Queue(['Typeset', Hub, element]))
            })
            .catch(() => {
                console.log('Warning: Could not load MathJax.')
            })
    }
})

const PollsCliqrApplication = Application.extend({
    region: '#cliqr-poll-container',

    initialize() {
        setupHandlebars()
        // @ts-ignore
        Backbone.$ = window.jQuery
        // @ts-ignore
        Backbone._ = window._

        // @ts-ignore
        Backbone.ajax = function() {
            const xhr = Backbone.$.ajax.apply(Backbone.$, arguments)
            return Promise.resolve(xhr)
        }

        this.layoutNotificationHandler = new LayoutNotificationHandler()
    },

    onBeforeStart(app, options) {
        if (window.cliqr.bootstrap.polls) {
            this.collection = new PollsCollection(window.cliqr.bootstrap.polls || [])
            delete window.cliqr.bootstrap.polls
        }

        this.collection = new PollsCollection()
    },

    onStart(app, options) {
        this.collection.fetch().then(() => {
            const page = new PollsIndexView({ collection: this.collection })
            this.showView(page)
        })
        Backbone.history.start()
    }
})

Raven.config('https://ef7d4098598b43c9958ea96398f826eb@sentry.virtuos.uos.de/2', {
    release: window.cliqr.version
}).install()
Raven.context(function() {
    const pollsApp = new PollsCliqrApplication()

    pollsApp.start({
        data: {}
    })
})
