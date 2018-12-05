import Backbone from 'backbone'
import _ from 'underscore'

let channel = null

const messageBus = _.assign(
    {
        broadcast(name, data = null) {
            this.trigger(name, data)
            if (channel) {
                // console.log('@send broadcast debug', name, data)
                channel.postMessage({ name, data })
            }
        }
    },
    Backbone.Events
)

if ('BroadcastChannel' in self) {
    channel = new BroadcastChannel('cliqr-bus')
    channel.onmessage = function({ data: { name, data } }) {
        // console.log('@receive broadcast debug', name, data)
        messageBus.trigger(name, data)
    }
}

export default messageBus
