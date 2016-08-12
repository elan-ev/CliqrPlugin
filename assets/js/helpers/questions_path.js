const questions_path = function (action) {
    let path = action
    if (!(action === 'index' || action === 'new')) {
        path += '/' + this.id
    }
    return cliqr.config.PLUGIN_URL + ('questions/' + path + '?cid=') + cliqr.config.CID
}

export default questions_path
