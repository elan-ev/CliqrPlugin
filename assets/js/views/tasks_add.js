import Backbone from 'backbone'
import _ from 'underscore'

import taskTypes from '../models/task_types'
import Viewmaster from './viewmaster'

const TasksAddView = Viewmaster.extend({

    tagName: 'div',

    className: 'tasks-add',

    $mode: 'button',
    $selectedType: null,

    events: {
        'click .js-show-chooser': 'onClickShowChooser',
        'click .js-add-question': 'onClickAddQuestion'
    },

    initialize() {
        Viewmaster.prototype.initialize.call(this)
    },

    template: require ('../../hbs/tasks-add.hbs'),

    context() {

        return {
            STUDIP: window.STUDIP,
            $mode: this.$mode,
            $selectedType: this.$selectedType,
            taskTypes: taskTypes.map(t => {
                const instance = new (t.get('class'))
                return {
                    id: t.id,
                    name: instance.name,
                    icn: instance.icon,
                    selected: t.id === this.$selectedType
                }
            })
        }
    },

    selectTypeCreator(id) {
        if (this.$selectedType !== id) {
            this.$selectedType = id

            const type = taskTypes.getTaskType(this.$selectedType)
            this.setView('main', type.getCreateView(this.model))
            this.refreshViews()
        }
    },

    onClickShowChooser(event) {
        event.preventDefault()

        this.$mode = 'form'
        this.render()
    },

    onClickAddQuestion(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('.js-add-question').data('typeid')
        this.selectTypeCreator(id)
    }
})

export default TasksAddView
