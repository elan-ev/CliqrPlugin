import Backbone from 'backbone'
import _ from 'underscore'

const decorateTaskGroup = function (taskGroup) {
    const id = taskGroup.get('id')
    return {
        ...taskGroup.toJSON()
    }
}

const CreateView = Backbone.View.extend({

    initialize(options) {
        console.log("CreateView#initialize")
    },

    render() {
        const template = require('../../../hbs/task-types/scales-create.hbs')
        this.$el.html(template(decorateTaskGroup(this.model)))
        return this
    }
})

export default CreateView
