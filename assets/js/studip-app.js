import Backbone from 'backbone'
import jQuery from 'jquery'
import QuestionsRouter from './routers/questions'

import TaskTypes from './models/task_types'
import MultipleChoice from './task-types/multiple-choice'

import core_css from '../scss/core.scss'

class StudIPCliqrApp {
    constructor() {
        this.initBackbone()
        this.initStuff()
        this.initRouters()
        this.initTaskTypes()

        Backbone.history.start()
    }

    initBackbone() {
        Backbone.$ = jQuery
    }

    initStuff() {
        setTimeout( () => { Backbone.$('.self-destroy').remove() }, 5000)
    }

    initRouters() {
        let router = new QuestionsRouter()
    }

    initTaskTypes() {
        TaskTypes.add({ id: 'multiple-choice', class: MultipleChoice })
    }
}

const app = new StudIPCliqrApp('#cliqr-container')
