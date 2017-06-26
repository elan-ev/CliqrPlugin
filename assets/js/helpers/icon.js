import { SafeString, escapeExpression } from 'handlebars/runtime'

const icon = function (icon, { hash } ) {
    let { color = 'blue', text = '' } = hash

    text = escapeExpression(text)

    const addClasses = (escapeExpression(hash['class']) || '')

    const icon_path = [STUDIP.ASSETS_URL, 'images/icons/', color, '/', escapeExpression(icon), '.svg'].join('')
    return new SafeString(`<img class="cliqr--icon ${addClasses}" src="${icon_path}" alt="${text}" title="${text}">`)
}

export default icon
