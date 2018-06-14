import '@babel/polyfill'
import './public-path.js'
import Backbone from 'backbone'
import jQuery from 'jquery'

import core_css from '../scss/core.scss'
import PollsRouter from './routers/polls'

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

const app = new PollCliqrApp('#cliqr-poll-container')
