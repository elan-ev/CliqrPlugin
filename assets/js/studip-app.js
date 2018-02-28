import 'babel-polyfill'
import './public-path.js'
import Backbone from 'backbone'
import jQuery from 'jquery'

import Raven from 'raven-js'

import core_css from '../scss/core.scss'
import StudipRouter from './routers/studip'

Raven
    .config('https://a879a81910984614afcb9cb19aff7727@sentry.io/255435')
    .install()

window.onunhandledrejection = function (evt) {
    Raven.captureException(evt.reason)
}

class StudIPCliqrApp {
    constructor(selector) {
        this.initBackbone()
        this.initStuff()
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

    initStuff() {
        Backbone.$(document).on('click', '.cliqr--click-once', (e) => {
            Backbone.$(e.target).closest('button').prop('disabled', true).addClass('loading')
        })
    }

    initRouters(selector) {
        let router = new StudipRouter({ selector })
    }
}

Raven.context(function () {
    const app = new StudIPCliqrApp('#cliqr-container')
})
