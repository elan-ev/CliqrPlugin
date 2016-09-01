import Backbone from 'backbone'

import CreateView from './scales/create'
import AuthorView from './scales/author'
import AssignmentView from './scales/assignment'

class Scales {
    constructor(task) {
        this.task = task
    }

    get id() {
        return 'scales'
    }

    get icon() {
        return 'favorite'
    }

    get name() {
        return 'Scales'
    }

    getAssignmentView(voting) {
        return new AssignmentView({ model: this.task, voting })
    }

    getAuthorView() {
        return new AuthorView({ model: this.task })
    }

    getCreateView(taskGroup) {
        return new CreateView({ model: taskGroup })
    }
}

export default Scales
