import { SafeString, escapeExpression } from 'handlebars/runtime'

const iconMaker = (color, icon, text) => {
    return (
        `<img src="${[window.STUDIP.ASSETS_URL, 'images/icons/', color, '/', escapeExpression(icon), '.svg'].join('')}" alt="${text}">` +
        `<img src="${[window.STUDIP.ASSETS_URL, 'images/icons/white/', escapeExpression(icon), '.svg'].join('')}" alt="">`
    )
}

const button = function (klass, text, { hash } ) {
    let { icon = false, disabled = false, color = 'blue', once = false, type = 'button' } = hash
    let icons = ''
    const disabledAttr = disabled ? 'disabled' : ''

    text = escapeExpression(text)
    color = escapeExpression(color)
    klass = 'js-' + escapeExpression(klass)

    const addClasses = (escapeExpression(hash['class']) || '')
          + (once ? ' cliqr--click-once' : '')
          + (icon ? ' cliqr--button-with-icon' : '')

    if (icon) {
        icons = iconMaker(color, icon, text)
    }

    return new SafeString(`
            <button type="${type}" class="button cliqr--button ${klass} ${addClasses}" name="${text}" ${disabledAttr}>
              ${icons} ${text}
            </button>`)
}

export default button
