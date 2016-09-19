import _ from 'underscore'
import Task from '../../models/task'

const MCTask = Task.extend({
    defaults: {
        type:  'multiple-choice',
        task: {
            type: 'single',
            answers: []
        }
    },

    validate({ description, task }, options) {
        if (!description || _.isEmpty(description)) {
            return {
                'attribute': 'description',
                'text': 'Die Frage kann nicht leer sein.'
            }
        }

        if (!task) {
            return {
                'attribute': 'task',
                'text': 'Task fehlt.'
            }
        }

        const { answers = false } = task
        if (!answers || _.isEmpty(answers)) {
            return {
                'attribute': 'task.answers',
                'text': 'Es wird mindestens eine Antwort benötigt.'
            }
        }

        return null
    },

    addAnswer(data = {}, options = {}) {
        const oldTask = this.get('task')
        const answers = [ ...oldTask.answers, { text: '', score: 0, feedback: 0, ...data  } ]
        this.set('task', { ...oldTask, answers }, options)
    },

    removeAnswer(index, options = {}) {
        const oldTask = this.get('task')
        console.log("before", arguments, oldTask)
        const answers = [
            ...oldTask.answers.slice(0, index),
            ...oldTask.answers.slice(index + 1),
        ]
        this.set('task', _.tap({ ...oldTask, answers }, (x) => console.log("after", x)), options)
    },

    updateAnswer(index, data, options = {}) {
        const oldTask = this.get('task')
        const selectedAnswer = oldTask.answers[index]
        const answers = [
            ...oldTask.answers.slice(0, index),
            { ...selectedAnswer, ...data },
            ...oldTask.answers.slice(index + 1)
        ]
        this.set('task', { ...oldTask, answers }, { silent: true })
    }
})

export default MCTask
