const charCodeA = 'A'.charCodeAt(0),
      helpers = {
          nominal: function (index) {
              return String.fromCharCode(charCodeA + index % 26)
          }
      }

export default helpers
