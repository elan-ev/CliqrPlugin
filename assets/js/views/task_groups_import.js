import Viewmaster from './viewmaster'
import { showLoading } from '../utils'

const cancel = function (e) {
    e.stopPropagation()
    e.preventDefault()
}

const TaskGroupsImportView = Viewmaster.extend({

    tagName: 'article',

    className: 'cliqr--task-groups-import',

    events: {
        'click .js-cancel': 'onClickCancel',
        'change input': 'onChangeFileInput',

        'dragenter .cliqr--upload-box': cancel,
        'dragover .cliqr--upload-box': cancel,
        'drop .cliqr--upload-box': 'onDropFile'
    },

    template: require('../../hbs/task-groups-import.hbs'),

    context() {
        return this.collection.toJSON()
    },

    onClickCancel(event) {
        event.preventDefault()
        this.trigger('cancel', event, this)
    },

    onChangeFileInput(event) {
        event.preventDefault()
        if (event.target.files.length) {
            const fileReader = new FileReader()

            fileReader.onload = (event) => {

                try {
                    JSON.parse(event.target.result)
                } catch (err) {
                    window.STUDIP.Dialog.confirm(
                        'Die Datei hat nicht das richtige Format. Möchten Sie eine andere Datei hochladen?',
                        () => {},
                        () => this.trigger('cancel', event, this)
                    )
                    return
                }

                this.$('form').submit()
                this.trigger('cancel', event, this)
                showLoading()
            }

            fileReader.readAsText(event.target.files[0])
        }
    },

    onDropFile(event) {
        event.stopPropagation()
        event.preventDefault()

        const files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files

        if (files.length > 1) {
            window.STUDIP.Dialog.confirm(
                'Cliqr kann im Moment nur einzelne Dateien importieren. Möchten Sie es noch einmal probieren?',
                () => {},
                () => this.trigger('cancel', event, this)
            )
        } else {
            this.$('input[type="file"]')[0].files = files
        }
    }
})

export default TaskGroupsImportView
