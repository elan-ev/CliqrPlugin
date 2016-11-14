import Backbone from 'backbone'
import _ from 'underscore'

import MultipleChoice from '../task-types/multiple-choice/multiple-choice'
import Scales from '../task-types/scales/scales'


const TaskTypesCollection = Backbone.Collection.extend({

    getTaskType(task) {
        const type = _.isObject(task) ? taskTypes.get(task.get('type')) : taskTypes.get(task)
        if (!type) {
            throw new Error(`Could not find task type: ${type}`);
        }
        const klass = type.get('class')
        return new klass(task)
    }
})

const taskTypes = new TaskTypesCollection()

taskTypes.add({
    id: 'multiple-choice',
    name: 'Multiple Choice',
    icon: 'assessment',
    class: MultipleChoice
})

taskTypes.add({
    id: 'scales',
    name: 'Skalen',
    icon: 'code',
    class: Scales
})

export default taskTypes
