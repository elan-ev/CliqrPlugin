import { SafeString, escapeExpression } from 'handlebars/runtime'

const i18n = function (text, { hash }) {
    text = escapeExpression(text)
    return new SafeString(text)
}

module.exports = i18n
