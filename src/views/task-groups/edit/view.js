import Radio from 'backbone.radio'
import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import showError from '../../../error'
import template from './edit.hbs'

export default View.extend({
    tagName: 'article',
    className: 'cliqr--task-groups-show',

    events: {
        'submit form': 'onClickEditTaskGroup',
        'click .js-cancel': 'onClickCancel'
    },

    initialize({ store }) {
        store.trigger('navigation', 'task-group', this.model)
        const title = this.model.getTitle(40)
        Radio.channel('layout').request('change:pagetitle', `Fragensammlung «${title}» bearbeiten`)
    },

    template,

    templateContext() {
        return {
            breadcrumb: {
                task_group_id: this.model.id,
                task_group_title: this.model.get('title')
            }
        }
    },

    onClickEditTaskGroup(event) {
        event.preventDefault()

        const title = this.$('form')[0].title.value.trim()

        if (!title.length) {
            return
        }

        this.model
            .save({ title })
            .then(() => {
                Backbone.history.navigate(`task-groups/show/${this.model.id}`, { trigger: true })
            })
            .catch(error => {
                showError('Could not edit task group', error)
            })
    },

    onClickCancel() {
        Backbone.history.navigate(`task-groups/show/${this.model.id}`, { trigger: true })
    }
})
