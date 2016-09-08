import { SafeString, escapeExpression } from 'handlebars/runtime'

const icon = function (icon, { hash } ) {
    let { color = 'blue' } = hash

    const icon_path = [STUDIP.ASSETS_URL, 'images/icons/', color, '/', escapeExpression(icon), '.svg'].join('')
    return new SafeString(`<img class="cliqr--icon" src="${icon_path}">`)
}

export default icon
