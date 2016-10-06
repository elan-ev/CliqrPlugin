import { SafeString } from 'handlebars/runtime'

const strip_tags = function (html) {
    const div = window.document.createElement('div')
    div.innerHTML = html

    return new SafeString(div.textContent || div.innerText || '')
}

export default strip_tags
