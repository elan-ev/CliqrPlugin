import Backbone from 'backbone'
import _ from 'underscore'
import mc from '../task-types/multiple-choice'
import scales from '../task-types/scales'

const TaskTypesCollection = Backbone.Collection.extend({
    fetchTaskType(task) {
        const type = _.isObject(task) ? taskTypes.get(task.get('type')) : taskTypes.get(task)
        if (!type) {
            throw new Error(`Could not find task type: ${type}`)
        }

        const loader = type.get('loader')
        return loader().then(klass => {
            return new klass(task)
        })
    }
})

const taskTypes = new TaskTypesCollection([mc, scales])

export default taskTypes
