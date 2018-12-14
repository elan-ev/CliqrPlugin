const url_for = function(path) {
    return [window.cliqr.config.PLUGIN_URL, path, '?cid=', window.cliqr.config.CID].join('')
}

export default url_for
