/**
 * Vertical resize support for div, textarea, iframe, etc.
 *
 * A problem with the resize feature of textarea and iframe is that it does not work in all
 * browsers (especially Edge) and is often quite quirky. This small package allows you to
 * add vertical resize ability to just about anything.
 *
 */

import ResizerActual from './resizer-actual.js';

function Resizer(sel, options) {
    var elements = document.querySelectorAll(sel);
    for(var i=0; i<elements.length; i++) {
        new ResizerActual(elements[i], options);
    }
}

export default Resizer;
