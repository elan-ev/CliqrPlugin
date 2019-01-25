import Backbone from 'backbone'
import _ from 'underscore'

const TaskTypesCollection = Backbone.Collection.extend({
    fetchTaskType(task) {
        const type = _.isObject(task) ? taskTypes.get(task.get('type')) : taskTypes.get(task)
        if (!type) {
            throw new Error(`Could not find task type: ${type}`)
        }

        let taskTypePromise

        switch (type.get('id')) {
            case 'multiple-choice':
                taskTypePromise = require.ensure(
                    [],
                    function(require) {
                        const klass = require('../task-types/multiple-choice/multiple-choice').default
                        return new klass(task)
                    },
                    'task-type.multiple-choice'
                )
                break

            case 'scales':
                taskTypePromise = require.ensure(
                    [],
                    function(require) {
                        const klass = require('../task-types/scales/scales').default
                        return new klass(task)
                    },
                    'task-type.scales'
                )
                break
        }

        return taskTypePromise
    }
})

const taskTypes = new TaskTypesCollection()

taskTypes.add({
    id: 'multiple-choice',
    name: 'Multiple Choice',
    icon: 'assessment'
    // , module: '../task-types/multiple-choice/multiple-choice'
    // , class: MultipleChoice
})

taskTypes.add({
    id: 'scales',
    name: 'Skalen',
    icon: 'code'
    // , module: '../task-types/scales/scales'
    // , class: Scales
})

export default taskTypes
