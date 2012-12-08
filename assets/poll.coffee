###
Provide top-level namespaces for our javascript.
###
window.cliqr ||=
  config: {}
  model: {}
  router: {}
  ui: {}

###
Initialize the router and start Backbone hash listening magic
###
$(document).ready () ->

  ###
  As the webpage contains the initial polls, pre-populate the global
  $Polls (the initial $ indicates a global variable) with these. This
  way we spare us an initial AJAX call.
  ###
  cliqr.$Polls = new cliqr.model.PollCollection cliqr.config.POLLS || []

  ###
  Declare the global $App object (the initial $ indicates a global
  variable). We need it to dynamically navigate between routes etc.
  ###
  cliqr.$App = new cliqr.router.AppRouter()

  Backbone.history.start()
  return

###
We use Mustache as template engine. This function makes it a lot
easier to get a pre-compiled Mustache template.
###
compileTemplate = _.memoize \
  (name) ->
    Mustache.compile $("#cliqr-template-#{name}").html()


###
TODO: docu für pollview
###
cliqr.ui.PageView = do ->

  enhancePage = (el) ->
    $(el).page("destroy").page() if el.parentNode

  Backbone.View.extend
    initialize: ->
      old_render = @render
      @render = ->
        view = old_render.apply @, arguments
        enhancePage view.el
        view


###
TODO: docu für nominal
###
nominal =
  do (A = "A".charCodeAt 0) ->
    (index) ->
      String.fromCharCode A + index % 26

###
TODO: docu für pollview
###
class cliqr.ui.PollView extends cliqr.ui.PageView
  template: compileTemplate("poll")

  events:
    "submit form": "recordAnswer"

  render: ->

    poll = @collection.firstFresh()

    if poll
      for answer, index in poll.get('answers')
        answer.nominal = nominal index

    @$el.html @template poll: poll?.toJSON()
    @

  recordAnswer: (event) =>
    event.preventDefault()

    id = @$("input[name=vote_id]", event.target).val()

    if cliqr.model.id_list.test id
      alert "ha!"
    else
      $.post(cliqr.$Polls.url(), @$("form").serialize())
        .always () ->
          cliqr.model.id_list.add id
          console.log "always", arguments, id
        .done (msg) =>
          @render()
        .fail (jqXHR, textStatus) ->
          return

###
TODO: docs für Poll
###
cliqr.model.Poll = Backbone.Model.extend
  initialize: ->
    console.log "initialized a Poll", arguments

###
TODO: docs für PollCollection
###
cliqr.model.PollCollection = Backbone.Collection.extend

  model: cliqr.model.Poll

  initialize: ->
    console.log "initialized a PollCollection", arguments

  url: ->
    cliqr.config.PLUGIN_URL + "poll/" + cliqr.config.RANGE_ID

  comparator: (poll) ->
    poll.get 'startdate'

  firstFresh: ->
    @find (model) ->
      not cliqr.model.id_list.test model.id

###
TODO docs
###
cliqr.model.id_list = do ->

  KEY = "cliqr.model.IDList"

  # stale after a single day
  #DECAY_TIME = 60 * 60 * 24
  DECAY_TIME = 15

  time = ->
    Math.floor(Date.now() / 1000)

  fetch = ->
    console.log "fetch"
    JSON.parse(window.localStorage.getItem(KEY)) ? {}

  save = (ids) ->
    console.log "saved: ", JSON.stringify ids
    window.localStorage.setItem KEY, JSON.stringify ids
    ids

  removeStaleIDs = (old_ids) ->
    best_before = time() - DECAY_TIME
    ids = {}
    for id, timestamp of old_ids when timestamp >= best_before
      ids[id] = timestamp
    ids

  fetchClean = _.compose save, removeStaleIDs, fetch


  ids = fetchClean()

  $(window).on "storage", -> ids = fetch()


  # refresh: ->
  #   ids = fetchClean()
  #   @

  add: (id) ->
    console.log "add: ", JSON.stringify id
    ids[id] = time()
    console.log ids
    save ids
    @

  remove: (id) ->
    unset ids[id]
    save ids
    @

  test: (id) ->
    ids[id]?


###
Customized Backbone.Router playing nicely with jqm
###
cliqr.router.PageRouter = Backbone.Router.extend

  initialize: () ->
    @firstPage = true

  ###
  Internal function to be used by the route handlers.

  `page` is a Backbone.View which is added as a jQuery mobile page to
  the pageContainer. Eventually, after all the setup mojo and
  everything is in place, the `jQuery mobile way`(TM) of changing
  pages is invoked.
  ###
  changePage: (page) ->

    ###
    add "data-role=page" to the element of the page, then render and insert into the body
    ###
    $(page.el).attr('data-role', 'page')
    page.render()
    $('body').append $ page.el

    ###
    do not use transition for first page
    ###
    transition = $.mobile.defaultPageTransition
    if @firstPage
      transition = 'none'
      @firstPage = false

    ###
    call the jqm function
    ###
    $.mobile.changePage $(page.el),
      changeHash: false
      transition: transition

###
The singleton AppRouter containing the handlers for all the routes.
###
cliqr.router.AppRouter = cliqr.router.PageRouter.extend

  routes:
    "": "showPoll"

  showPoll: ->
    @changePage new cliqr.ui.PollView collection: cliqr.$Polls
