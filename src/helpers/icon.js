import { SafeString, escapeExpression } from 'handlebars/runtime'

const icon = function(icon, { hash }) {
    let { color = 'blue', text = '' } = hash

    color = escapeExpression(color)
    icon = escapeExpression(icon)
    text = escapeExpression(text)

    const addClasses = escapeExpression(hash['class']) || ''

    return new SafeString(
        `<i class="cliqr--icon cliqr--icon-${icon} ${addClasses} cliqr--icon-color-${color}" alt="${text}" title="${text}"></i>`
    )
}

export default icon
