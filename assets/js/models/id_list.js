import _ from 'underscore'

const KEY = 'cliqr.model.IDList'
const DECAY_TIME = 60 * 60 * 24 * 1000

const fetch = function () {
    const item = window.localStorage.getItem(KEY)
    if (item === null) {
        return {}
    } else {
        return JSON.parse(item)
    }
}

const save = function (ids) {
    window.localStorage.setItem(KEY, JSON.stringify(ids))
    return ids
}

const removeStaleIDs = function (old_ids) {
    const best_before = Date.now() - DECAY_TIME
    const ids = {}
    for (let id in old_ids) {
        let timestamp = new Date(old_ids[id]).valueOf()
        if (timestamp >= best_before) {
            ids[id] = old_ids[id]
        }
    }
    return ids
}

class IDList {

    constructor() {
        _.compose(save, removeStaleIDs, fetch)()
    }

    add(poll) {
        var ids = fetch()
        ids[poll.id] = poll.get('start')
        save(ids)
        return this
    }

    remove(poll) {
        var ids = fetch()
        delete ids[poll.id]
        save(ids)
        return this
    }

    test(poll) {
        return fetch()[poll.id] === poll.get('start')
    }
}

export default IDList
