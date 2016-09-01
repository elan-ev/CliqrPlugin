import Backbone from 'backbone'
import jQuery from 'jquery'
import Promise from 'bluebird'

import QuestionsRouter from './routers/questions'

import TaskTypes from './models/task_types'
import MultipleChoice from './task-types/multiple-choice'
import Scales from './task-types/scales'

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
        Promise.config({
            longStackTraces: true,
            warnings: true
        })

        Backbone.$ = jQuery

        Backbone.ajax = function () {
            const xhr = Backbone.$.ajax.apply(Backbone.$, arguments)
            return Promise.resolve(xhr)
        }
    }

    initStuff() {
        setTimeout( () => { Backbone.$('.self-destroy').remove() }, 5000)
    }

    initRouters(selector) {
        let router = new QuestionsRouter({ selector })
    }

    initTaskTypes() {
        TaskTypes.add({ id: 'multiple-choice', class: MultipleChoice })
        TaskTypes.add({ id: 'scales', class: Scales })
    }
}

const app = new StudIPCliqrApp('#cliqr-container')
