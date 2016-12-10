import { SafeString, escapeExpression } from 'handlebars/runtime'

const charCodeA = 'A'.charCodeAt(0)

const nominal = function (index) {
    return String.fromCharCode(charCodeA + parseInt(index, 10) % 26)
}

module.exports = nominal
