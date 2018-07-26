import { SafeString, escapeExpression } from 'handlebars/runtime'

const iconMaker = (color, icon, text) => {
    return (
        `<i class="cliqr--icon cliqr--icon-${icon} cliqr--icon-color-${color}" alt="${text}" title="${text}"></i>`
    )
}

const button = function (klass, text, { hash } ) {
    let { icon = false, disabled = false, color = 'blue', once = false, type = 'button' } = hash
    let iconString = ''
    const disabledAttr = disabled ? 'disabled' : ''

    text = escapeExpression(text)
    color = escapeExpression(color)
    klass = 'js-' + escapeExpression(klass)

    const addClasses = (escapeExpression(hash['class']) || '')
          + (once ? ' cliqr--click-once' : '')
          + (icon ? ' cliqr--button-with-icon' : '')

    if (icon) {
        iconString = iconMaker(color, escapeExpression(icon), text)
    }

    return new SafeString(`
            <button type="${type}" class="button cliqr--button ${klass} ${addClasses}" name="${text}" ${disabledAttr}>
              ${iconString} ${text}
            </button>`)
}

export default button
