import Backbone from 'backbone'
import _ from 'underscore'

import AssignmentView from './views/assignment'
import CreateView from './views/create'
import EditView from './views/edit'
import PollView from './views/poll'
import ShowView from './views/show'

import ScalesTask from './models/task'
import ScalesResponse from './models/response'

import scalesCss from './scales.scss'

class Scales {
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
        const task = new ScalesTask()
        _.times(1, () => task.addStatement())
        return task
    }

    wrapTask(task) {
        return new ScalesTask(task.attributes)
    }

    createResponse(voting) {
        const response = new ScalesResponse({ voting_id: voting.id, task_id: voting.getTask().id })
        return response
    }
}

_.extend(Scales.prototype, Backbone.Events)

export default Scales
