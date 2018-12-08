import '@babel/polyfill'
import './public-path.js'
import Backbone from 'backbone'
import '../scss/core.scss'
import setupHandlebars from './setupHandlebars.js'
import StudipRouter from './routers/studip'
import SidebarView from './views/component-sidebar'

class StudIPCliqrApp {
    constructor(selector) {
        setupHandlebars()
        this.initBackbone()
        this.initStuff()
        this.initRouters(selector)

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

        const sidebar = new SidebarView({ el: '#layout-sidebar' })
    }

    initStuff() {
        Backbone.$(document).on('click', '.cliqr--click-once', e => {
            Backbone.$(e.target)
                .closest('button')
                .prop('disabled', true)
                .addClass('loading')
        })
    }

    initRouters(selector) {
        let router = new StudipRouter({ selector })
    }
}

const app = new StudIPCliqrApp('#cliqr')
