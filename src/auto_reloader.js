/* global $, sessionStorage, location, jQuery */ // false alarm linter

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var AutoReloader = function autoReloader (options) {
  var returnit = {}
  // validatng functions
  var checkBool = function checkBool (args) {
    // check if passed args are 'true' or 'false' type
    for (var a in args) {
      if (args[a] !== 'true' && args[a] !== 'false') return false
    }
    return true
  }
  var checkType = function checkType (type, args) {
    // checking the type of each varible in the passed array
    for (var a in args) {
      if (typeof args[a] !== type) return false
    }
    return true
  }

  // main class, contains all
  if (typeof options !== 'object') options = {}
  returnit.options = { // inserted options, with defaults
    identifier: options.identifier || '.autoreloader', // class or id to identify the autoloading element with
    duration: options.duration * 1000 || 5000, // duration number in seconds, in-which each reload is due
    add_classes: options.add_classes || ['btn-danger'], // css classes to add or remove with start or stop
    add_classes_span: options.add_classes_span || ['fa-spin'], // to add classes to span inside button
    add_style: options.add_style || ';font-size: 200%; color: green;', // css style to add or remove with start or stop
    remember_position: options.remember_position || 'true', // to remember the screen position after reload
    fix_rotation: options.screen_rotation || 'true', // to fix screen size rotation with reload
    auto_start: options.auto_start || 'false' // to start auto reloading without element click
  }

  returnit.defaults = {
    sleeps: []  // to store timeouts
  }

  returnit.__init__ = function __init__ () {
  // Validation
    // Type validation
    if (!checkType('string', [
      returnit.options.add_classes]) && !(
        returnit.options.add_classes instanceof Array)
      ) throw new TypeError('auto_reloader(options) add_classes requires array of strings')
    if (!checkType('string', [
      returnit.options.add_classes_span]) && !(
        returnit.options.add_classes_span instanceof Array)
      ) throw new TypeError('auto_reloader(options) add_classes_span requires array of strings')
    if (!checkType('string', [
      returnit.options.identifier,
      returnit.options.add_style
    ])) throw new TypeError('auto_reloader(options) identifier, add_style require strings')
    if (!checkBool([
      returnit.options.remember_position,
      returnit.options.fix_rotation
    ])) throw new TypeError('auto_reloader(options) remember_position, fix_rotation require "true" or "false"')
    if (typeof returnit.options.duration !== 'number' || returnit.options.duration < 0) throw new TypeError('auto_reloader(options) duration requires valid number')
    // Value validation
    if (!(returnit.options.identifier.startsWith('.')) && !(returnit.options.identifier.startsWith('#'))) throw new Error('auto_reloader(options) identifier should start with # or .')
    if ($(returnit.options.identifier).length <= 0 && returnit.options.auto_start === 'false') throw new Error('auto_reloader(options) can not find any elements with identifier')
  // Setup directions
    $(returnit.options.identifier).click(function (event) {
      if (sessionStorage.active === undefined) start(); else stop() // start or stop if clicked
    })
    if (sessionStorage.active !== undefined || returnit.options.auto_start === 'true') start() // start if not first time
  }

// Starter and Stopper

  // global name to access from events
  var start = function start () {
    // starting the auto reload, changing style
    if (sessionStorage.active !== undefined) {
      returnit.set_style(false)
      if (returnit.options.remember_position) $(window).scrollTop(sessionStorage.position) // to remember position
      if (returnit.options.fix_rotation) returnit.check_screen() // to watch out for screen size change
      returnit.reload() // timeout to reload
    } else {
      returnit.set_style()
      returnit.reload(0)
    }
  }
  // global name to access from events
  var stop = function stop () {
    // stopping the auto reload clearing timeouts restoring style
    returnit.restore_style()
    if (returnit.defaults.sleeps.length > 0) {
      $.each(returnit.defaults.sleeps, function (i, value) {
        clearTimeout(value)
      })
    }
    // clearing up the storage
    sessionStorage.clear()
  }

// When Started

  returnit.reload = function reload (duration = sessionStorage.duration || returnit.options.duration) {
    // setting timeout to reload
    // clearing timeouts before loading
    returnit.defaults.sleeps.push(
      setTimeout(function () {
        sessionStorage.position = $(window).scrollTop() // getting screen position
        sessionStorage.active = 'true' // to indeicate not a first time
        location.reload()
      }, duration)
    )
  }
  returnit.check_screen = function checkScreen (
    // setting event watch for screen resize or rotation and reload if so
    height = $(window).height(),
    width = $(window).width()) {
    jQuery(function ($) {
      $(window).resize(function () {
        if (height !== $(window).height() || width !== $(window).width()) {
          location.reload()
        }
      })
    })
  }
  returnit.set_style = function setStyle (notactive = true) {
    // setting the button style with style and class
    for (var i = 0; returnit.options.add_classes.length > i; i += 1) {
      $(returnit.options.identifier).addClass(returnit.options.add_classes[i])
    }
    for (var i = 0; returnit.options.add_classes_span.length > i; i += 1) {
      $(returnit.options.identifier + '> span').addClass(returnit.options.add_classes_span[i])
    }
    if ($(returnit.options.identifier).attr('style') !== undefined && notactive) {
      sessionStorage.style = $(returnit.options.identifier).attr('style') // storing style
      $(returnit.options.identifier).attr(
        'style', sessionStorage.style + ';' + returnit.options.add_style
      ) // adding style to existing one
    } else {
      if (sessionStorage.style !== undefined) $(returnit.options.identifier).attr('style', sessionStorage.style + ';' + returnit.options.add_style)
      else $(returnit.options.identifier).attr('style', returnit.options.add_style)
    }
  }

// When Stopped

  returnit.restore_style = function restoreStyle () {
    // restoring the button previous style
    for (var i = 0; returnit.options.add_classes.length > i; i += 1) {
      if ($(returnit.options.identifier).hasClass(returnit.options.add_classes[i])) {
        $(returnit.options.identifier).removeClass(returnit.options.add_classes[i])
      }
    }
    for (var i = 0; returnit.options.add_classes_span.length > i; i += 1) {
      if ($(returnit.options.identifier + ' > span').hasClass(returnit.options.add_classes_span[i])) {
        $(returnit.options.identifier + ' > span').removeClass(returnit.options.add_classes_span[i])
      }
    }
    if (sessionStorage.style !== undefined) {
      $(returnit.options.identifier).attr('style', sessionStorage.style)
      sessionStorage.style = false
    } else { // if style not stored and equal to iserted style, will be emptied
      if ($(returnit.options.identifier).attr('style') === returnit.options.add_style) {
        $(returnit.options.identifier).attr('style', '')
      }
    }
  }

// Interactive settings

  returnit.ask = function ask (msg="Enter new auto-reload duration in seconds : ") {
    // to prompt user to set new duration
    var newDuration = window.prompt(
      msg,
      sessionStorage.duration / 1000 || returnit.options.duration / 1000
    )
    sessionStorage.duration = newDuration > 0 ? newDuration * 1000 : returnit.options.duration
  }

// Initiate and return the class

  returnit.__init__()
  return returnit
}
