/**
 * Vertical resize support for div, textarea, iframe, etc.
 *
 * A problem with the resize feature of textarea and iframe is that it does not work in all
 * browsers (especially Edge) and is often quite quirky. This small package allows you to
 * add vertical resize ability to just about anything.
 *
 * @version 2.4.0 Added touch support. Limited speed of resizing to avoid issue when scrolling.
 */

import {ResizerActual} from './resizer-actual';
import {Options} from './Options';


/**
 * Constructor for a Resizer object
 * @param sel Selector or DOM element
 * @param options Options object.
 * @constructor
 */
export function Resizer(sel, options) {
    options = new Options(options);

    if(typeof sel === "string") {
        var elements = document.querySelectorAll(sel);
        for(var i=0; i<elements.length; i++) {
            new ResizerActual(elements[i], options);
        }
    } else if(sel.nodeType) {
        new ResizerActual(sel, options);
    }
}

export default Resizer;
