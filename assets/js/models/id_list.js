import _ from 'underscore'

const KEY = 'cliqr.model.IDList'
const DECAY_TIME = 60 * 60 * 24 * 1000

let memoryStore = {}

const unpickle = function() {
    try {
        const fromStorage = window.localStorage.getItem(KEY)
        if (fromStorage) {
            memoryStore = JSON.parse(fromStorage)
        }
    } catch (e) {}

    return memoryStore
}

const pickle = function(ids) {
    try {
        window.localStorage.setItem(KEY, JSON.stringify(ids))
    } catch (e) {}
}

const isStale = function(item) {
    const decay = Date.now() - DECAY_TIME
    const timestamp = new Date(item).valueOf()
    return timestamp < decay
}

class IDList {
    constructor() {
        this.ids = _.reduce(
            unpickle(),
            (memo, value, key) => {
                if (!isStale(value)) {
                    memo[key] = value
                }
                return memo
            },
            {}
        )
    }

    add(poll) {
        this.ids[poll.id] = poll.get('start')
        pickle(this.ids)

        return this
    }

    remove(poll) {
        delete this.ids[poll.id]
        pickle(this.ids)

        return this
    }

    test(poll) {
        return this.ids[poll.id] === poll.get('start')
    }
}

export default IDList
