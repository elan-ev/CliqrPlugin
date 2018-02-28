import 'babel-polyfill'
import './public-path.js'
import Backbone from 'backbone'
import jQuery from 'jquery'

import Raven from 'raven-js'

import core_css from '../scss/core.scss'
import PollsRouter from './routers/polls'

Raven
    .config('https://a879a81910984614afcb9cb19aff7727@sentry.io/255435')
    .install()

window.onunhandledrejection = function (evt) {
    Raven.captureException(evt.reason)
}

class PollCliqrApp {
    constructor(selector) {
        this.initBackbone()
        this.initRouters(selector)

        Backbone.history.start()
    }

    initBackbone() {
        Backbone.$ = jQuery

        Backbone.ajax = function () {
            const xhr = Backbone.$.ajax.apply(Backbone.$, arguments)
            return Promise.resolve(xhr)
        }
    }

    initRouters(selector) {
        let router = new PollsRouter({ selector })
    }
}

Raven.context(function () {
    const app = new PollCliqrApp('#cliqr-poll-container')
})
