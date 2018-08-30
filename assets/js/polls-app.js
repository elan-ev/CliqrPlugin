import '@babel/polyfill'
import './public-path.js'
import Backbone from 'backbone'
import jQuery from 'jquery'

import showError from './error'

import PollsCollection from './models/polls'
import PollsIndexView from './views/polls_index'

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// instantiate then remove bootstrapped
const bootstrapPolls = function() {
    const polls = new PollsCollection(window.cliqr.bootstrap.polls || [])
    delete window.cliqr.bootstrap.polls
    return polls
}

const fetchPolls = function() {
    if (window.cliqr.bootstrap.polls) {
        return Promise.resolve(bootstrapPolls())
    }

    const polls = new PollsCollection()
    return polls.fetch().then(() => polls)
}

class PollCliqrApp {
    constructor(selector) {
        this.selector = selector
        this.initBackbone()
        this.initPage()
        this.initSW()
    }

    initBackbone() {
        Backbone.$ = jQuery

        Backbone.ajax = function() {
            const xhr = Backbone.$.ajax.apply(Backbone.$, arguments)
            return Promise.resolve(xhr)
        }
    }

    initPage() {
        fetchPolls()
            .then(collection => {
                const page = new PollsIndexView({ collection })
                page.$el.appendTo(Backbone.$(this.selector))
                page.render()
                page.postRender()
            })
            .catch((...args) => {
                showError('Die Abstimmung konnte nicht geladen werden.', args)
            })
    }

    initSW() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker
                    .register('service-worker.js', {
                        scope: './'
                    })
                    .then(function(registration) {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope)
                    })
                    .catch(function(err) {
                        console.log('ServiceWorker registration failed: ', err)
                    })
            })

            navigator.serviceWorker.ready
                .then(function(registration) {
                    console.log('worker is active', registration)

                    // Use the PushManager to get the user's subscription to the push service.
                    return registration.pushManager.getSubscription()
                        .then(async function(subscription) {
                            // If a subscription was found, return it.
                            if (subscription) {
                                return subscription;
                            }

                            // Get the server's public key
                            const response = await fetch(window.cliqr.config.PLUGIN_URL + 'vapid/publicKey');
                            const vapidPublicKey = await response.text();
                            // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
                            // urlBase64ToUint8Array() is defined in /tools.js
                            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

                            // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
                            // send notifications that don't have a visible effect for the user).
                            return registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: convertedVapidKey
                            });
                        });
                }).then(function(subscription) {
                    console.log("send the sub:", subscription)
                    // Send the subscription details to the server using the Fetch API.
                    fetch('./register', {
                        method: 'post',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            subscription: subscription
                        })
                    });
                }).catch((...args) => { console.log("got an error", args) })
        }
    }
}

const app = new PollCliqrApp('#cliqr-poll-container')
