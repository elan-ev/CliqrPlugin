import Backbone from 'backbone'
import _ from 'underscore'


const showConfirmDialog = function (question, yes, no = null) {
    window.STUDIP.Dialog.confirm(question, yes, no)
}

const showDialog = function (backboneView) {

    const dialogClass = _.uniqueId('cliqr--dialog')

    Backbone.$(document).on(
        `dialog-update.${dialogClass}`,
        (event, data) => {
            if (data.dialog.closest('.ui-dialog').hasClass(dialogClass)) {
                data.dialog.append(backboneView.$el).dialog('open')
            }
        })

    Backbone.$(document).on(
        `dialogcreate.${dialogClass}`,
        `.${dialogClass}`,
        function (event, data) {
            Backbone.$(event.target).dialog('option', 'autoOpen', false)
        }
    )

    Backbone.$(document).on(
        `dialogclose.${dialogClass}`,
        `.${dialogClass}`,
        function (event) {
            if (Backbone.$(this).hasClass(dialogClass)) {
                backboneView.remove()
                Backbone.$.off(`.${dialogClass}`)
            }
        }
    )

    window.STUDIP.Dialog.show('', { dialogClass })
}

export { showConfirmDialog, showDialog }
