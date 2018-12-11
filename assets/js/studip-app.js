import './public-path.js'

import '@babel/polyfill'
import '../scss/core.scss'

import Backbone from 'backbone'
import StudipRouter from './routers/studip'
import setupHandlebars from './setupHandlebars.js'
import store from './store/index'
import SidebarView from './views/component-sidebar'

class StudIPCliqrApp {
    constructor(selector) {
        setupHandlebars()
        this.initBackbone()
        this.initStuff()

        this.router = new StudipRouter({ selector, store })
        this.sidebar = new SidebarView({ el: '#layout-sidebar', store })

        Backbone.history.start()
    }

    initBackbone() {
        // @ts-ignore
        Backbone.$ = window.jQuery
        // @ts-ignore
        Backbone._ = window._

        // @ts-ignore
        Backbone.ajax = function() {
            const xhr = Backbone.$.ajax.apply(Backbone.$, arguments)
            return Promise.resolve(xhr)
        }
    }

    initStuff() {
        Backbone.$(document).on('click', '.cliqr--click-once', e => {
            Backbone.$(e.target)
                .closest('button')
                .prop('disabled', true)
                .addClass('loading')
        })
    }
}

const app = new StudIPCliqrApp('#cliqr')
