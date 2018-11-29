import Backbone from 'backbone'
import _ from 'underscore'
/*
const createBroadcastChannel = () => new BroadcastChannel('cliqr-bus')

const createBackboneChannel = () => {
    const dispatcher = _.clone(Backbone.Events)

    const channel = {
        name: 'cliqr-bus',
        onmessage: null,

        postMessage(message) {
            dispatcher.trigger('broadcast', message)
        }
    }

    dispatcher.on('broadcast', message => {
        if (_.isFunction(channel.onmessage)) {
            channel.onmessage(message)
        }
    })

    return channel
}

const createDummyChannel = () => ({
    name: 'clir-bus',
    onmessage: null,
    postMessage(message) {}
})

// const broadcastChannel = ('BroadcastChannel' in self) ? createBroadcastChannel() : createBackboneChannel()
const broadcastChannel = 'BroadcastChannel' in self ? createBroadcastChannel() : createDummyChannel()

export default broadcastChannel
*/

let channel = null

const messageBus = _.assign(
    {
        broadcast(name, data = null) {
            this.trigger(name, data)
            if (channel) {
                console.log('@send broadcast debug', name, data)
                channel.postMessage({ name, data })
            }
        }
    },
    Backbone.Events
)

if ('BroadcastChannel' in self) {
    channel = new BroadcastChannel('cliqr-bus')
    channel.onmessage = function({ data: { name, data } }) {
        console.log('@receive broadcast debug', name, data)
        messageBus.trigger(name, data)
    }
}

export default messageBus
