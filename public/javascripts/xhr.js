var xhr = (function () {

  var put = function (url, options, callback) {

    if (!callback) {
      callback = options
      options = {}
    }

    var xhr = new XMLHttpRequest ()
    xhr.open('PUT', url, true)

    if (options.headers) {
      Object.keys(options.headers).forEach(function (headerName) {
        xhr.setRequestHeader(headerName, options.headers[headerName])
      })
    };

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4) {
        if (xhr.status < 400) {
          console.log(xhr)
          callback(JSON.parse(xhr.response), xhr)
        } else {
          console.log('error')
        };
      };
    }

console.log(options.data)
    xhr.send(options.data)
    return xhr
  }

  return {
    put: put
  }
})()