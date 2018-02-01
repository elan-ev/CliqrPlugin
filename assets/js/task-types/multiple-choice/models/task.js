import _ from 'underscore'
import Task from '../../../models/task'

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
            return 'Der Fragetext darf nicht leer sein.'
        }

        if (window.STUDIP.wysiwyg && description.trim() === window.STUDIP.wysiwyg.htmlMarker) {
            return 'Der Fragetext darf nicht leer sein.'
        }

        if (!task) {
            return 'Task fehlt.'
        }

        const { answers = false } = task
        if (!answers || _.isEmpty(answers)) {
            return 'Es wird mindestens eine Antwort benötigt.'
        }

        return null
    },

    addAnswer(data = {}, options = {}) {
        const oldTask = this.get('task')
        const answers = [ ...oldTask.answers, { text: '', score: 0, feedback: '', ...data  } ]
        this.set('task', { ...oldTask, answers }, options)
    },

    removeAnswer(index, options = {}) {
        const oldTask = this.get('task')
        const answers = [
            ...oldTask.answers.slice(0, index),
            ...oldTask.answers.slice(index + 1),
        ]
        this.set('task', { ...oldTask, answers })
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
    },

    getAnswers() {
        return this.get('task').answers
    },

    setAnswers(answers) {
        this.set('task', { ...this.get('task'), answers }, { silent: true })
    },

    clearAnswers() {
        this.setAnswers([])
    },

    setSelectType(type) {
        if (type === 'single' || type === 'multiple') {
            this.set('task', { ...this.get('task'), type }, { silent: true })
        }
    },

    getSelectType() {
        return this.get('task').type
    }
})

export default MCTask
