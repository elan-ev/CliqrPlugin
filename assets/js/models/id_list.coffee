define [
  'underscore'
], (_) ->

  ###
  TODO docs
  ###
  id_list = do ->

    KEY = "cliqr.model.IDList"

    # stale after a single day
    DECAY_TIME = 60 * 60 * 24

    # stale after 15s
    #DECAY_TIME = 15

    time = ->
      Math.floor(Date.now() / 1000)

    fetch = ->
      item = window.localStorage.getItem(KEY)
      if item is null then {} else JSON.parse item

    save = (ids) ->
      window.localStorage.setItem KEY, JSON.stringify ids
      ids

    removeStaleIDs = (old_ids) ->
      best_before = time() - DECAY_TIME
      ids = {}
      for id, timestamp of old_ids when timestamp >= best_before
        ids[id] = timestamp
      ids

    removeStaleIDs = _.compose save, removeStaleIDs, fetch
    do removeStaleIDs

    # TODO possibly deprecated
    # ids = fetch()
    # jQuery(window).on "storage", -> ids = fetch()

    add: (poll) ->
      ids = fetch()
      ids[poll.id] = poll.get "startdate"
      save ids
      @

    remove: (poll) ->
      ids = fetch()
      delete ids[poll.id]
      save ids
      @

    test: (poll) ->
      fetch()[poll.id] is poll.get "startdate"
