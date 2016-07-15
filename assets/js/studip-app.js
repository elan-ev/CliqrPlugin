import { createStore, applyMiddleware } from 'redux'
import Backbone from 'backbone'
import QuestionsRouter from './routers/questions'


console.log(Backbone)

class StudIPCliqrApp {
    constructor() {
        this.initStuff()
        this.initRouters()

        Backbone.history.start()
    }

    initStuff() {
        // detectFeatures()
        setTimeout( () => { jQuery('.self-destroy').remove() }, 5000)
    }

    initRouters() {
        router = new QuestionsRouter()
    }

    /*
    detectFeatures() {
      return  if window.Modernizr

      mStyle = window.document.createElement('modernizr').style
      cssomPrefixes = 'Webkit Moz O ms'.split ' '

      testProp = (prop) ->
        ucProp = prop.charAt(0).toUpperCase() + prop.slice(1)
        props  = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split ' '

        return true for i in props when mStyle[i] != undefined

        false

      addCssClass = (prop, truthy) ->
        pref = if truthy then '' else 'no-'
        window.document.documentElement.className += ' ' + pref  + prop

      addCssClass "flexbox", testProp "flexWrap"
      addCssClass "flexboxlegacy", testProp "boxDirection"
    }
    */
}
