import { MnObject } from 'backbone.marionette';

export default MnObject.extend({
    channelName: 'layout',

    radioRequests: {
        'apply:mathjax': 'onApplyMathjax',
    },

    onApplyMathjax($selector) {
        let mathjaxP;

        if (window.MathJax && window.MathJax.Hub) {
            mathjaxP = Promise.resolve(window.MathJax);
        } else if (window.STUDIP && window.STUDIP.loadChunk) {
            mathjaxP = window.STUDIP.loadChunk('mathjax');
        }

        if (mathjaxP) {
            mathjaxP
                .then(({ Hub }) => {
                    $selector.each((index, element) => Hub.Queue(['Typeset', Hub, element]));
                })
                .catch(() => {
                    console.log('Warning: Could not load MathJax.');
                });
        }
    },
});