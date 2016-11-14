import Backbone from 'backbone'
import jQuery from 'jquery'

import PollsRouter from './routers/polls'

import TaskTypes from './models/task_types'
import MultipleChoice from './task-types/multiple-choice/multiple-choice'
import Scales from './task-types/scales/scales'

import core_css from '../scss/core.scss'

class PollCliqrApp {
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
    }

    initRouters(selector) {
        let router = new PollsRouter({ selector })
    }

    initTaskTypes() {
        TaskTypes.add({ id: 'multiple-choice', class: MultipleChoice })
        TaskTypes.add({ id: 'scales', class: Scales })
    }
}

const app = new PollCliqrApp('#cliqr-poll-container')
