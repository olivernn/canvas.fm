;var spinner = (function () {

  var elem

  var displaySpinner = function () {
    elem.addClass('throb')
  }

  var hideSpinner = function () {
    elem.removeClass('throb')
  }

  var init = function () {
    elem = $("#search img")

    Track.bind('searchStart', displaySpinner)
    Track.bind('searchEnd', hideSpinner)
  }

  return {
    init: init
  }
})()