import Radio from 'backbone.radio'
import Backbone from 'backbone'
import { CollectionView } from 'backbone.marionette'
import { showConfirmDialog } from '../../../dialog'
import showError from '../../../error'
import TaskCollection from '../../../models/tasks'
import EmptyView from './empty'
import ListItemView from './list-item'
import template from './show.hbs'

export default CollectionView.extend({
    className: 'task-groups-show',

    childView: ListItemView,
    childViewContainer: '.cliqr--task-list tbody',
    childViewOptions() {
        return { store: this.store }
    },
    childViewEventPrefix: 'childview',

    emptyView: EmptyView,
    emptyViewContainer: 'tbody',
    emptyViewOptions() {
        return {
            model: this.model
        }
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

    events: {
        sortupdate: 'onSortUpdate'
    },

    initialize({ store }) {
        this.store = store
        this.store.trigger('navigation', 'task-group', this.model)
        const title = this.model.get('title')
        Radio.channel('layout').request('change:pagetitle', `Fragensammlung «${title}»`)

        this.collection = new TaskCollection(this.model.get('tasks'))
    },

    onSortUpdate(event, ui) {
        const $childElement = ui.item
        const newIndex = $childElement
            .parent()
            .children()
            .index($childElement)

        const model = this.collection.get($childElement.attr('data-model-cid'))

        this.collection.remove(model)
        this.collection.add(model, { at: newIndex })
        this.$el.sortable('refresh')

        const positions = this.collection.map(item => item.id)

        this.model
            .reorder(positions)
            .catch((...attrs) => showError('Die Sortierung konnte nicht gespeichert werden.', attrs))
    },

    onAddChild(container, view) {
        view.$el.attr('data-model-cid', view.model.cid)
    },

    onRenderChildren() {
        if (this.$el.sortable('instance')) {
            this.$el.sortable('refresh')
        }
    },

    onRender() {
        if (!this.$el.sortable('instance')) {
            this.$el
                .sortable({
                    handle: '.cliqr--task-checkbox',
                    items: 'tbody tr',
                    cursor: 'ns-resize',
                    opacity: 1
                })
                .disableSelection()
        }
    },

    onChildviewStartTask(view, event) {
        event.preventDefault()

        view.model
            .startVoting()
            .then(voting => {
                Backbone.history.navigate(`voting/${voting.id}`, { trigger: true })
                return null
            })
            .catch(error => {
                showError('Could not start voting', error)
            })
    },

    onChildviewStopTask(view, event) {
        event.preventDefault()

        const running = view.model.getVotings().find(a => a.isRunning())
        running
            .stop()
            .then(() => {
                return null
            })
            .catch(error => {
                showError('Could not stop voting', error)
            })
    },

    onChildviewDuplicateTask(view, event) {
        event.preventDefault()

        view.model
            .duplicate()
            .then(task => {
                this.collection.once('add', () => {
                    const next = view.$el.nextAll().last()[0]
                    if (next) {
                        next.scrollIntoView()
                    }
                })
                this.collection.add(task)
                return null
            })
            .catch(error => {
                showError('Could not duplicate task', error)
            })
    },

    onChildviewRemoveTask(view, event) {
        event.preventDefault()
        showConfirmDialog(`Wollen Sie diese Frage wirklich löschen?`, () => {
            view.model.destroy().catch(error => {
                showError('Could not remove task group', error)
            })
        })
    }
})
