import { SafeString, escapeExpression } from 'handlebars/runtime'

const icon = function (icon, { hash } ) {
    const icon_path = [STUDIP.ASSETS_URL, 'images/icons/blue/', escapeExpression(icon), '.svg'].join('')
    return new SafeString(`<img class="cliqr--icon" src="${icon_path}">`)
}

export default icon
