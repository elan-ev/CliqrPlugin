var CACHE = 'cliqr-site-cache::v1'
var expectedCaches = [CACHE]

var urlsToCache = [
    './index.html',
    './assets/vendor/bulma/bulma.css',
    './assets/vendor/rangeslider-2.3.2/rangeslider.min.css',
    './assets/vendor/jquery-3.3.1/jquery-3.3.1.min.js',
    './assets/vendor/rangeslider-2.3.2/rangeslider.min.js',

    './static/polls.css',
    './static/polls.js',
    './static/task-type.multiple-choice.chunk.js',
    './static/task-type.multiple-choice~task-type.scales.chunk.js',
    './static/task-type.scales.chunk.js',

    '../../../assets/javascripts/mathjax/MathJax.js?config=TeX-AMS_HTML,default',
    '../../../assets/javascripts/mathjax/config/TeX-AMS_HTML.js',
    '../../../assets/javascripts/mathjax/config/default.js',
    '../../../assets/javascripts/mathjax/images/MenuArrow-15.png'
]

self.addEventListener('install', installer)
self.addEventListener('activate', activator)
self.addEventListener('fetch', fetcher)

function installer(event) {
    event.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.addAll(urlsToCache)
        })
    )
    console.log("installed cliqr sw")
}

function activator(event) {
    event.waitUntil(clients.claim())

    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise
                .all(keys.filter(function (key) {
                    return !expectedCaches.includes(key)
                }).map(function (key) {
                    console.log("delete cache:", key)
                    return caches.delete(key)
                }))
        })
    )
    console.log("activated cliqr sw")
}

function fetcher(event) {
    var fetchRequest = event.request.clone()
    event.respondWith(
        caches.open(CACHE).then(function(cache) {
            return cache.match(fetchRequest).then(function(matching) {
                console.log(matching ? "found:" : "fetched:", fetchRequest.url)
                return matching || fetch(fetchRequest)
            })
        })
    )
}
