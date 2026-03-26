const strip_tags = function (html) {
    if (!html) {
        return '';
    }
    const cleaned = new DOMParser().parseFromString(html, 'text/html');

    return cleaned.body.textContent || '';
};

export default strip_tags;