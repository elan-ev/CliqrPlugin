import Backbone from 'backbone'
import _ from 'underscore'
import Promise from 'bluebird'


const showConfirmDialog = function (question, yes, no = null) {
    window.STUDIP.Dialog.confirm(question, yes, no)
}

const showDialog = function (backboneView, dialogOptions) {

    return new Promise(function (resolve, reject) {

        const hygenicDialogClass = _.uniqueId('cliqr--dialog-')

        Backbone.$(document).on(
            `dialog-update.${hygenicDialogClass}`,
            (event, data) => {
                if (data.dialog.closest('.ui-dialog').hasClass(hygenicDialogClass)) {
                    data.dialog.append(backboneView.$el).dialog('open')
                    resolve(() => data.dialog.dialog('close'))
                }
            })

        Backbone.$(document).on(
            `dialogcreate.${hygenicDialogClass}`,
            `.${hygenicDialogClass}`,
            function (event, data) {
                Backbone.$(event.target).dialog('option', 'autoOpen', false)
            }
        )

        Backbone.$(document).on(
            `dialogclose.${hygenicDialogClass}`,
            `.${hygenicDialogClass}`,
            function (event) {
                if (Backbone.$(this).hasClass(hygenicDialogClass)) {
                    backboneView.remove()
                    Backbone.$(document).off(`.${hygenicDialogClass}`)
                }
            }
        )

        window.STUDIP.Dialog.show('', {
            buttons: null,
            id: hygenicDialogClass,
            ...dialogOptions,
            dialogClass: `cliqr--dialog ${hygenicDialogClass}`
        })
    })

}

export { showConfirmDialog, showDialog }
