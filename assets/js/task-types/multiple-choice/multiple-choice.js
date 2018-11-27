import Backbone from 'backbone'
import _ from 'underscore'

import AssignmentView from './views/assignment'
import CreateView from './views/create'
import EditView from './views/edit'
import PollView from './views/poll'
import ShowView from './views/show'

import MCTask from './models/task'
import MCResponse from './models/response'

import mc_css from './multiple-choice.scss'

import Handlebars from 'handlebars-template-loader/runtime'
import mcHeader from './hbs/mc_header.hbs'
Handlebars.registerPartial('mc_header', mcHeader)

class MultipleChoice {
    constructor(task) {
        this.task = task
    }

    // Ansicht eines Votings einer Frage
    getAssignmentView(voting) {
        return new AssignmentView({ model: this.task, voting, type: this })
    }

    // Details einer Frage /tasks/show/{{id}}
    getShowView() {
        return new ShowView({ model: this.task, type: this })
    }

    // Formular zum Bearbeiten einer Frage /tasks/edit/{{id}}
    getEditView() {
        return new EditView({ model: this.wrapTask(this.task), type: this })
    }

    // Formular zum Anlegen einer Frage
    getCreateView(taskGroup) {
        return new CreateView({ model: this.createTask(), taskGroup, type: this })
    }

    // Formular zum Beantworten einer Frage
    getPollView(voting) {
        return new PollView({ model: this.createResponse(voting), voting, type: this })
    }

    createTask(data) {
        const task = new MCTask()
        _.times(4, () => task.addAnswer())
        return task
    }

    wrapTask(task) {
        return new MCTask(task.attributes)
    }

    createResponse(voting) {
        const response = new MCResponse({ voting_id: voting.id, task_id: voting.getTask().id })
        return response
    }
}

_.extend(MultipleChoice.prototype, Backbone.Events)

export default MultipleChoice
