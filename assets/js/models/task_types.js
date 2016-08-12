import Backbone from 'backbone'
import _ from 'underscore'

const TaskTypesCollection = Backbone.Collection.extend({

    getTaskType(task) {
        const type = taskTypes.get(task.get('type'))
        if (!type) {
            throw 'TODO';
        }
        const klass = type.get('class')
        return new klass(task)
    }

})

const taskTypes = new TaskTypesCollection()

export default taskTypes
