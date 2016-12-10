import { SafeString, escapeExpression } from 'handlebars/runtime'

const icon = function (icon, { hash } ) {
    let { color = 'blue', text = '' } = hash

    text = escapeExpression(text)

    const icon_path = [STUDIP.ASSETS_URL, 'images/icons/', color, '/', escapeExpression(icon), '.svg'].join('')
    return new SafeString(`<img class="cliqr--icon" src="${icon_path}" alt="${text}" title="${text}">`)
}

module.exports = icon
