import Backbone from 'backbone'
import _ from 'underscore'

import CreateView from './multiple-choice/create'
import AuthorView from './multiple-choice/author'
import AssignmentView from './multiple-choice/assignment'

import MCTask from './multiple-choice/task'

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

    createTask(data) {
        const task = new MCTask()
        _.times(3, () => task.addAnswer())
        console.log(task)
        return task
    }
}

export default MultipleChoice
