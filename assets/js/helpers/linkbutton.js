import { SafeString, escapeExpression } from 'handlebars/runtime'

const linkbutton = function (href, text, { hash } ) {
    let { icon = false } = hash
    let icon_el = ''

    text = escapeExpression(text)
    href = escapeExpression(href)

    const addClasses = escapeExpression(hash['class']) || ''

    if (icon) {
        icon_el = `<img src="${[window.STUDIP.ASSETS_URL, 'images/icons/blue/', escapeExpression(icon), '.svg'].join('')}" alt="${text}">`
    }

    return new SafeString(`
            <a class="button cliqr--button ${addClasses}" href="${href}">
              ${icon_el} ${text}
            </a>`)
}

export default linkbutton
