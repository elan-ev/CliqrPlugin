import './public-path.js'
import Backbone from 'backbone'
import { Application, MnObject, View } from 'backbone.marionette'
import Raven from 'raven-js'
import './assets/scss/core.scss'
import StudipRouter from './routers/studip'
import setupHandlebars from './setupHandlebars.js'
import store from './store/index'
import SidebarView from './views/sidebar/view'

const LayoutNotificationHandler = MnObject.extend({
    channelName: 'layout',

    radioRequests: {
        'change:pagetitle': 'onChangePagetitle',
        'scroll:top': 'onScrollTop',
        'show:loading': 'onShowLoading',
        'hide:loading': 'onHideLoading',
        'apply:mathjax': 'onApplyMathjax'
    },

    initialize({ layout }) {
        this.layout = layout
        this.timeout = null
    },

    onChangePagetitle(newTitle) {
        const title = document.head.querySelector('title')
        const original = title && title.dataset.original
        if (original) {
            const prefix = original.substring(0, original.length - 5)
            this.layout.triggerMethod('change:pagetitle', prefix + newTitle)
        }
    },

    onScrollTop() {
        const { left, top } = this.layout.$el.offset()
        Backbone.$('html, body').animate({ scrollLeft: left - 20, scrollTop: top - 20 })
    },

    onShowLoading() {
        this.timeout = setTimeout(() => {
            Backbone.$(window.document.body).addClass('cliqr--loading')
        }, 300)
    },

    onHideLoading() {
        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
        }
        Backbone.$(window.document.body).removeClass('cliqr--loading')
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

const MyBaseLayout = View.extend({
    template: false,

    regions: {
        content: '#cliqr',
        pageTitle: '#current_page_title',
        sidebar: {
            el: '#layout-sidebar',
            replaceElement: false
        }
    },

    initialize() {
        this.showChildView('sidebar', new SidebarView({ el: '#layout-sidebar', store }))
        this.router = new StudipRouter({ selector: this.getRegion('content').$el, store })

        this.layoutNotificationHandler = new LayoutNotificationHandler({ layout: this })
    },

    onChangePagetitle(title) {
        document.title = title
        this.getRegion('pageTitle').$el.text(title)
    }
})

const StudipCliqrApplication = Application.extend({
    region: '#layout_page',

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

        Backbone.$(document).on('click', '.cliqr--click-once', e => {
            Backbone.$(e.target)
                .closest('button')
                .prop('disabled', true)
                .addClass('loading')
        })

        Backbone.$(document).on('mouseleave', '.cliqr--moment, .cliqr--button-fab, span.bubble', function(event) {
            const { tooltipObject } = Backbone.$(this).data()
            tooltipObject && tooltipObject.hide()
        })
    },

    onBeforeStart(app, options) {
        // console.log('onBeforeStart', app, options)
        // this.model = new MyModel(options.data);
    },

    onStart(app, options) {
        // console.log('onStart', app, options)
        this.showView(new MyBaseLayout({ el: '#layout_container' }))
        Backbone.history.start()
    }
})

Raven.config('https://ef7d4098598b43c9958ea96398f826eb@sentry.virtuos.uos.de/2', {
    release: window.cliqr.version
}).install()
Raven.context(function() {
    const myApp = new StudipCliqrApplication()

    myApp.start({
        data: {}
    })
})
