import { CollectionView } from 'backbone.marionette'
import { showConfirmDialog, showDialog } from '../../../dialog'
import showError from '../../../error'
import * as TaskGroups from '../index'
// import EmptyView from './empty'
import ListItemView from './list-item'
import indexTemplate from './view.hbs'
import Radio from 'backbone.radio'

export default CollectionView.extend({
    className: 'cliqr--task-groups-index',

    childView: ListItemView,
    childViewContainer: '.task-groups tbody',
    childViewOptions() {
        return { store: this.store }
    },
    childViewEventPrefix: 'childview',

    // emptyView: EmptyView,

    template: indexTemplate,

    ui: {
        add: '.js-add-task-group',
        import: '.js-import-task-group'
    },

    triggers: {
        'click @ui.add': 'add:taskgroup',
        'click @ui.import': 'import:taskgroup'
    },

    initialize({ store }) {
        this.store = store
        store.trigger('navigation', 'task-groups')
        Radio.channel('layout').request('change:pagetitle', 'Fragensammlungen')
    },

    onAddTaskgroup(view, event) {
        event.preventDefault()
        const createDialog = new TaskGroups.CreateView({ collection: this.collection, store: this.store })
        showDialog(createDialog.render(), { title: 'Fragensammlung erstellen', size: 'small' })
            .then(closer => createDialog.once('cancel', closer))
            .catch(error => {
                showError('Could not create task group', error)
            })
    },

    onImportTaskgroup(view, event) {
        event.preventDefault()

        const importDialog = new TaskGroups.ImportView({ collection: this.collection, store: this.store })
        showDialog(importDialog.render(), { title: 'Fragensammlung importieren' })
            .then(closer => importDialog.once('cancel', closer))
            .catch(error => {
                showError('Could not import task group', error)
            })
    },

    onChildviewRemoveTaskgroup({ model }, event) {
        event.preventDefault()

        showConfirmDialog(`Wollen Sie die Fragensammlung "${model.get('title')}" wirklich löschen?`, () => {
            model.destroy().catch(error => {
                showError('Could not remove task group', error)
            })
        })
    },

    onChildviewDuplicateTaskgroup({ model }, event) {
        event.preventDefault()

        model
            .duplicate()
            .then(taskGroup => {
                this.collection.add(taskGroup)
                return null
            })
            .catch(error => {
                showError('Could not duplicate task group', error)
            })
    },

    onChildviewExportTaskgroup({ model }, event) {
        event.preventDefault()

        window.open(model.exportURL())
    }
})
