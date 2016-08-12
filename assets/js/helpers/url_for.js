const url_for = function (resource, action) {
    let path = [resource, action].join('/')
    if (!(action === 'index' || action === 'new')) {
        path += '/' + this.id
    }
    return [cliqr.config.PLUGIN_URL, path, '?cid=', cliqr.config.CID].join()
}

export default url_for
