import { $ } from 'backbone'

export function toast({
    dismissible = true,
    duration = 2000,
    message = 'Your message here',
    position = 'is-center is-bottom',
    type = null
}) {
    let noticesTop = $('.notices.is-top')
    let noticesBottom = $('.notices.is-bottom')

    if (!noticesTop.length || !noticesBottom.length) {
        noticesTop = $("<div class='notices is-top'></div").appendTo(document.body)
        noticesBottom = $("<div class='notices is-bottom'></div").appendTo(document.body)
    }

    const toast = $('<div class="notification"></div')
        .addClass(position)
        .addClass(type)
        .text(message)
        .appendTo(/is-bottom/.test(position) ? noticesBottom : noticesTop)

    if (dismissible) {
        toast.append($('<button class="delete"></button>')).on('click', () => { toast.remove() })
    }

    setTimeout(() => {
        toast.remove()
    }, duration)
}
