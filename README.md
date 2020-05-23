# Resizer

_Resizing resize support for div, textarea, iframe, etc._

A problem with the resize feature of textarea and iframe is that it does not work in all
browsers (especially Edge) and is often quite quirky. This small package allows you to 
add resize ability to just about anything. This package has no dependencies.

## Install

### CDN

Link directly to Resizer files on [unpkg](https://unpkg.com/).

``` html
<script src="https://unpkg.com/resizer-cl/dist/resizer.js"></script>
<!-- or -->
<script src="https://unpkg.com/resizer-cl/dist/resizer.min.js"></script>
```

### Package managers

[npm](https://www.npmjs.com/package/resizer-cl): `npm install resizer-cl --save`

## Initialize

The node_modules/dist directory includes resizer.js and the minimized version resizer.min.js
(recommended). 

Most basic version. Resizer accepts a selector and will apply Resizer to all elements that
match the selector.

```
new Resizer('textarea');
```

Resizer uses the CSS min-height, min-width, max-height, and max-width as absolute
bounds on the size. Here is some example CSS for a textarea
that works well with Resizer:

```
textarea {
  width: 80%;
  height: 25em;
  min-height: 15em;
  background-color: #f0fffb;
}
```

Resizer will also accept a DOM element as the parameter. 

### Using with iframe

The recommended way to apply Resizer to an iframe is to actually apply it to a surrounding
div. An iframe has special restrictions on mouse usage that can break Resizer if used directly.
This is an example of how to apply Resizer to an iframe:

HTML:

```
<div class="iframe"><iframe></iframe></div>
```

CSS:

```
div.iframe {
  position: relative;
  width: 80%;
  min-height: 5em;
  height: 10em;
  padding: 0;
}

iframe {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
```

Javascript:

```
new Resizer('.iframe');
```

## Options

Resizer accepts an object with options:

```
new Resizer('div.example', {
    grabSize: 10,
    resize: 'both',
    handle: 'bar'
});
```

The possible options are: 

handle: 'bar', 'handle', '12px solid blue'

The `bar` option indicates that a solid green bar 10 pixels tall is added to the bottom of
the element as a bottom order. Grab that bar to resize. The `handle` option indicates that
the resize: vertical style will be set and the normal resize handle will appear if supported
by the browser and usually only for textarea. Future versions of Resizer may include a cross-platform handle. If desired,
an arbitrary bottom border can also be provided:

```
new Resizer('.iframe', {
    handle: '10px solid red'
});
```

The `grabSize` option determines how many pixels from the bottom of the element comprise the
grab area that can be grabbed by the mouse.

The 'resize' option determines which dimensions are subject to resizing. The options are
'vertical', 'horizontal', and 'both'.

## License

Resizer is released under the MIT license.

* * *

Made by Charles B. Owen

