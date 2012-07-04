(function ($) {
    $(document).ready(function() {
        var resultsContainer = $("#cliqr_vote_results");
        if(resultsContainer.size() > 0) {
            // load vote results every 10 seconds
            var resultsUrl = location.pathname.replace(/show/, "results") +
                location.search;
            refreshContainer(resultsContainer, resultsUrl, 10000);
        }
    });
    
    // replace the contents of a container every timeout miliseconds with the
    // response when the given url is requested
    function refreshContainer(container, url, timeout) {
        $.get(url, "", function(data) {
            container.html(data);
        });
        window.setTimeout(function() {
            refreshContainer(container, url, timeout);
        }, timeout);
    }
}(jQuery));