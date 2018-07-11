import '@babel/polyfill'
import './public-path.js'
import Backbone from 'backbone'
import jQuery from 'jquery'

import core_css from '../scss/core.scss'
import StudipRouter from './routers/studip'

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

const app = new StudIPCliqrApp('#cliqr')
