import Backbone from 'backbone'
import jQuery from 'jquery'

import StudipRouter from './routers/studip'
import TaskTypes from './models/task_types'
import MultipleChoice from './task-types/multiple-choice/multiple-choice'
// import Scales from './task-types/scales'

import core_css from '../scss/core.scss'

class StudIPCliqrApp {
    constructor(selector) {
        this.initBackbone()
        this.initStuff()
        this.initRouters(selector)
        this.initTaskTypes()

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
        setTimeout( () => { Backbone.$('.self-destroy').remove() }, 5000)
        Backbone.$(document).on('click', '.cliqr--click-once', (e) => {
            Backbone.$(e.target).closest('button').prop('disabled', true).addClass('loading')
        })
    }

    initRouters(selector) {
        let router = new StudipRouter({ selector })
    }

    initTaskTypes() {
        TaskTypes.add({ id: 'multiple-choice', class: MultipleChoice })
        // TaskTypes.add({ id: 'scales', class: Scales })
    }
}

const app = new StudIPCliqrApp('#cliqr-container')
