import Backbone from 'backbone'
import _ from 'underscore'

import AssignmentView from './multiple-choice/assignment'
import AuthorView from './multiple-choice/author'
import CreateView from './multiple-choice/create'
import PollView from './multiple-choice/poll'

import MCTask from './multiple-choice/task'
import MCResponse from './multiple-choice/response'

class MultipleChoice {
    constructor(task) {
        this.task = task
    }

    get id() {
        return 'multiple-choice'
    }

    get icon() {
        return 'assessment'
    }

    get name() {
        return 'Multiple Choice'
    }

    getAssignmentView(voting) {
        return new AssignmentView({ model: this.task, voting, type: this })
    }

    getAuthorView() {
        return new AuthorView({ model: this.task, type: this })
    }

    getCreateView(taskGroup) {
        return new CreateView({ model: this.createTask(), taskGroup, type: this })
    }

    getPollView(voting) {
        return new PollView({ model: this.createResponse(voting), voting, type: this })
    }

    createTask(data) {
        const task = new MCTask()
        _.times(2, () => task.addAnswer())
        return task
    }

    createResponse(voting) {
        const response = new MCResponse({ assignment_id: voting.id, task_id: voting.getTask().id })
        return response
    }
}

export default MultipleChoice
