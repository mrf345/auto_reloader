# auto_reloader (Beta)
### [jQuery][ba494823] based, simple page reloader

  [ba494823]: https://jquery.com "jQuery website"

## [Live Demo][8ec584c0]

  [8ec584c0]: https://audio-sequence.github.io/auto_reloader.html "Live demo"

![Demo GIF](https://audio-sequence.github.io/auto_reloader.gif)

## Setup :

```html
<head>
  <script source="auto_reloader.js" type="text/javascript"></script>
  <script type="text/javascript">
    $(document).ready(function () {
      const reloader = AutoReloader({
        identifier: '.reload'
      })
    });
  </script>
</head>
<body>
  <button class='reload'>Reload It</button>
</body>
```

## Options :

```javascript
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
```
## Functions :
#### To use any of the following functions, you have to get an instance of the constructor, which we did in the Setup section :
` const reloader = auto_reloader()` </br>
` reloader.following_functions()`

```javascript
const start = function start () {
  // starting the auto reload, changing style
}

const stop = function stop () {
  // stopping the auto reload clearing timeouts restoring style
}
```
## Dependencies:
- jQuery
