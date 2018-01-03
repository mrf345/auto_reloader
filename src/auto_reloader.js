/* global $, sessionStorage, location, jQuery */ // false alarm linter

/*

Script : auto_reloader 0.1 beta
Author : Mohamed Feddad
Date : 2017/12/27
Dependencies: jquery
License : MPL 2.0
today's lesson : simplicity is a luxury, one mustn't expose.

*/

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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

var auto_reloader = function autoReloader (options) {
  // main class, contains all
  if (typeof options !== 'object') options = {}

  this.options = { // inserted options, with defaults
    identifier: options.identifier || '.autoreloader', // class or id to identify the autoloading element with
    duration: options.duration * 1000 || 5000, // duration number in seconds, in-which each reload is due
    add_classes: options.add_classes || ['btn-danger'], // css classes to add or remove with start or stop
    add_classes_span: options.add_classes_span || ['fa-spin'], // to add classes to span inside button
    add_style: options.add_style || ';font-size: 200%; color: green;', // css style to add or remove with start or stop
    remember_position: options.remember_position || 'true', // to remember the screen position after reload
    fix_rotation: options.screen_rotation || 'true', // to fix screen size rotation with reload
    auto_start: options.auto_start || 'false' // to start auto reloading without element click
  }

  this.defaults = {
    sleeps: []  // to store timeouts
  }

  this.__init__ = function __init__ () {
  // Validation
    // Type validation
    if (!checkType('string', [
      this.options.add_classes]) && !(
        this.options.add_classes instanceof Array)
      ) throw new TypeError('auto_reloader(options) add_classes requires array of strings')
    if (!checkType('string', [
      this.options.add_classes_span]) && !(
        this.options.add_classes_span instanceof Array)
      ) throw new TypeError('auto_reloader(options) add_classes_span requires array of strings')
    if (!checkType('string', [
      this.options.identifier,
      this.options.add_style
    ])) throw new TypeError('auto_reloader(options) identifier, add_style require strings')
    if (!checkBool([
      this.options.remember_position,
      this.options.fix_rotation
    ])) throw new TypeError('auto_reloader(options) remember_position, fix_rotation require "true" or "false"')
    if (typeof this.options.duration !== 'number' || this.options.duration < 0) throw new TypeError('auto_reloader(options) duration requires valid number')
    // Value validation
    if (!(this.options.identifier.startsWith('.')) && !(this.options.identifier.startsWith('#'))) throw new Error('auto_reloader(options) identifier should start with # or .')
    if ($(this.options.identifier).length <= 0 && this.options.auto_start === 'false') throw new Error('auto_reloader(options) can not find any elements with identifier')
  // Setup directions
    $(this.options.identifier).click(function (event) {
      if (sessionStorage.active === undefined) start(); else stop() // start or stop if clicked
    })
    if (sessionStorage.active !== undefined || this.options.auto_start === 'true') start() // start if not first time
  }

// Starter and Stopper

  // global name to access from events
  var start = function start () {
    // starting the auto reload, changing style
    if (sessionStorage.active !== undefined) {
      this.set_style(false)
      if (this.options.remember_position) $(window).scrollTop(sessionStorage.position) // to remember position
      if (this.options.fix_rotation) this.check_screen() // to watch out for screen size change
      this.reload() // timeout to reload
    } else {
      this.set_style()
      this.reload(0)
    }
  }
  // global name to access from events
  var stop = function stop () {
    // stopping the auto reload clearing timeouts restoring style
    this.restore_style()
    if (this.defaults.sleeps.length > 0) {
      $.each(this.defaults.sleeps, function (i, value) {
        clearTimeout(value)
      })
    }
    // clearing up the storage
    sessionStorage.clear()
  }

// When Started

  this.reload = function reload (duration = this.options.duration) {
    // setting timeout to reload
    // clearing timeouts before loading
    this.defaults.sleeps.push(
      setTimeout(function () {
        sessionStorage.position = $(window).scrollTop() // getting screen position
        sessionStorage.active = 'true' // to indeicate not a first time
        location.reload()
      }, duration)
    )
  }
  this.check_screen = function checkScreen (
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
  this.set_style = function setStyle (notactive = true) {
    // setting the button style with style and class
    for (var i = 0; this.options.add_classes.length > i; i += 1) {
      $(this.options.identifier).addClass(this.options.add_classes[i])
    }
    for (i = 0; this.options.add_classes_span.length > i; i += 1) {
      $(this.options.identifier + '> span').addClass(this.options.add_classes_span[i])
    }
    if ($(this.options.identifier).attr('style') !== undefined && notactive) {
      sessionStorage.style = $(this.options.identifier).attr('style') // storing style
      $(this.options.identifier).attr(
        'style', sessionStorage.style + ';' + this.options.add_style
      ) // adding style to existing one
    } else {
      if (sessionStorage.style !== undefined) $(this.options.identifier).attr('style', sessionStorage.style + ';' + this.options.add_style)
      else $(this.options.identifier).attr('style', this.options.add_style)
    }
  }

// When Stopped

  this.restore_style = function restoreStyle () {
    // restoring the button previous style
    for (var i = 0; this.options.add_classes.length > i; i += 1) {
      if ($(this.options.identifier).hasClass(this.options.add_classes[i])) {
        $(this.options.identifier).removeClass(this.options.add_classes[i])
      }
    }
    for (i = 0; this.options.add_classes_span.length > i; i += 1) {
      if ($(this.options.identifier + ' > span').hasClass(this.options.add_classes_span[i])) {
        $(this.options.identifier + ' > span').removeClass(this.options.add_classes_span[i])
      }
    }
    if (sessionStorage.style !== undefined) {
      $(this.options.identifier).attr('style', sessionStorage.style)
      sessionStorage.style = false
    } else { // if style not stored and equal to iserted style, will be emptied
      if ($(this.options.identifier).attr('style') === this.options.add_style) {
        $(this.options.identifier).attr('style', '')
      }
    }
  }

// Initiate and return the class

  this.__init__()
  return this
}
