import { SafeString, escapeExpression } from 'handlebars/runtime'

const button = function (klass, text, { hash } ) {
    let { icon = false } = hash
    let icon_el = ''

    text = escapeExpression(text)
    klass = 'js-' + escapeExpression(klass)

    const addClasses = escapeExpression(hash['class']) || ''

    if (icon) {
        icon_el = `<img src="${[STUDIP.ASSETS_URL, 'images/icons/blue/', escapeExpression(icon), '.svg'].join('')}" alt="${text}">`
    }

    return new SafeString(`
            <button type="submit" class="button cliqr--button ${klass} ${addClasses}" name="${text}">
              ${icon_el} ${text}
            </button>`)
}

export default button
