import Radio from 'backbone.radio'
import { View } from 'backbone.marionette'
import template from './create.hbs'

export default View.extend({
    tagName: 'article',

    className: 'cliqr--task-groups-create',

    events: {
        'submit form': 'onClickCreate',
        'click .js-cancel': 'onClickCancel'
    },

    initialize({ store }) {
        store.trigger('navigation', 'task-groups')
        Radio.channel('layout').request('change:pagetitle', 'Fragensammlung anlegen')
    },

    template,

    onClickCreate(event) {
        event.preventDefault()

        const title = this.$('form')[0].title.value.trim()

        if (!title.length) {
            return
        }

        this.collection.create(
            { title },
            {
                success: taskGroup => {
                    this.trigger('cancel', event, this)
                }
            }
        )
    },

    onClickCancel(event) {
        event.preventDefault()
        this.trigger('cancel', event, this)
    }
})
