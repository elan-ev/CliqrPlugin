import _ from 'underscore'

function sampleSize () {
    return _.reduce(this.answers, function (sum, answer) {
        return sum + answer.counter
    }, 0)
}

export default sampleSize
