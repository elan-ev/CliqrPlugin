import { SafeString, escapeExpression } from 'handlebars/runtime'

const iconMaker = (color, icon, text) => {
    return (
        `<img src="${[window.STUDIP.ASSETS_URL, 'images/icons/', color, '/', icon, '.svg'].join('')}" alt="${text}">` +
        `<img src="${[window.STUDIP.ASSETS_URL, 'images/icons/white/', icon, '.svg'].join('')}" alt="">`
    )
}

const fab = function (klass, text, icon, { hash }) {
    let { disabled = false, once = false } = hash
    const disabledAttr = disabled ? 'disabled' : ''

    text = escapeExpression(text)
    klass = 'js-' + escapeExpression(klass)

    const addClasses = (escapeExpression(hash['class']) || '') + (once ? ' cliqr--click-once' : '')

    const color = 'blue'

    return new SafeString(`
            <button type="submit" class="button cliqr--button-fab ${klass} ${addClasses}"
                    name="${text}" ${disabledAttr}
                    data-tooltip="${text}">
                ${iconMaker(color, escapeExpression(icon), text)}
            </button>`)
}

export default fab
