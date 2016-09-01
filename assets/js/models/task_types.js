import Backbone from 'backbone'
import _ from 'underscore'

const TaskTypesCollection = Backbone.Collection.extend({

    getTaskType(task) {
        const type = _.isObject(task) ? taskTypes.get(task.get('type')) : taskTypes.get(task)
        if (!type) {
            throw new Error('TODO');
        }
        const klass = type.get('class')
        return new klass(task)
    }
})

const taskTypes = new TaskTypesCollection()

export default taskTypes
