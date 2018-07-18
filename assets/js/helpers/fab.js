import { SafeString, escapeExpression } from 'handlebars/runtime'

const iconMaker = (color, icon, text) => {
    return (
        `<img src="${[window.STUDIP.ASSETS_URL, 'images/icons/', color, '/', icon, '.svg'].join('')}" alt="${text}">` +
        `<img src="${[window.STUDIP.ASSETS_URL, 'images/icons/white/', icon, '.svg'].join('')}" alt="">`
    )
}

const fab = function (klass, text, icon, { hash }) {
    let { disabled = false, once = false, flat = false, color = 'blue' } = hash
    const disabledAttr = disabled ? 'disabled' : ''

    text = escapeExpression(text)
    klass = 'js-' + escapeExpression(klass)
    color = escapeExpression(color)

    const addClasses = (escapeExpression(hash['class']) || '')
          + (once ? ' cliqr--click-once' : '')
          + (flat ? '  cliqr--flat' : '')

    return new SafeString(`
            <button type="button" class="button cliqr--button-fab ${klass} ${addClasses}"
                    name="${text}" ${disabledAttr}
                    data-tooltip="${text}">
                ${iconMaker(color, escapeExpression(icon), text)}
            </button>`)
}

export default fab
