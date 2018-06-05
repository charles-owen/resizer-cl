
function ResizerActual(element, options) {
    element.classList.add('resizer');

    if(options === undefined) {
        options = {};
    }

    var css = {
    };

    var grabSize = options.grabSize ? options.grabSize : 10;

    var handle = options.handle !== undefined ? options.handle : 'bar';
    if(handle === 'bar') {
        element.style.resize = 'none';
        element.style.borderBottom = grabSize + 'px solid #18453B';
    } else if(handle === 'handle') {
        element.style.resize = 'vertical';
    } else {
        element.style.resize = 'none';
        element.style.borderBottom = handle;
    }

    /// Mouse move event handler
    var installedMoveListener = null;
    var mask = null;

    /// Get the minimum height property
    var rect = element.getBoundingClientRect();
    var height = rect.height;

    var minHeight = getComputedStyle(element).minHeight;
    minHeight = minHeight.substr(0, minHeight.length - 2);

    function start() {
        // Install the mouse down listener
        element.addEventListener('mousedown', mouseDownListener);

        // Install the cursor listener
        element.addEventListener('mousemove', cursorListener);
    }

    var initialY;
    var initialHeight;

    function mouseDownListener(e) {
        if(onHandle(e.pageX, e.pageY)) {
            initialY = e.pageY;
            initialHeight = element.getBoundingClientRect().height;

            installHandlers();
            installMask();
        }
    }

    function mouseMoveListener(e) {
        if(e.buttons !== 1) {
            removeAll();
            return;
        }

        var dy = e.pageY - initialY;

        // Compute a desired new height
        var newHeight = initialHeight + dy;
        if (newHeight < minHeight) {
            newHeight = minHeight;
        }

        // Set it
        element.style.height = '' + newHeight + 'px';

    }

    function mouseUpListener(e) {
        removeAll();
    }

    function installHandlers() {
        removeHandlers();

        installedMoveListener = mouseMoveListener;
        document.addEventListener('mousemove', installedMoveListener);
        document.addEventListener('mouseup', mouseUpListener);
    }

    function installMask() {
        // Ensure none currently exists
        removeMask();

        var body = document.querySelector('body');
        var tag = '<div style="position: ' +
            'absolute; left: 0; right: 0; width: 100%; height: 100%;' +
            'background-color: green;"></div>';
        mask = document.createElement('div');

        mask.style.position = 'fixed';
        mask.style.left = 0;
        mask.style.top = 0;
        mask.style.width = "100%";
        mask.style.height = '100%';
        mask.style.backgroundColor = 'transparent';
        mask.style.zIndex = 10000;
        mask.style.opacity = 0.5;

        body.appendChild(mask);
    }

    function removeAll() {
        removeHandlers();
        removeMask();
    }

    function removeHandlers() {
        if(installedMoveListener === null) {
            return;
        }

        document.removeEventListener('mousemove', installedMoveListener);
        document.removeEventListener('mouseup', mouseUpListener);
        installedMoveListener = null;


    }

    function removeMask() {
        if(mask !== null) {
            var body = document.querySelector('body');
            body.removeChild(mask);
            mask = null;
        }
    }

    function onHandle(x, y) {
        var rect = element.getBoundingClientRect();
        var bottom = rect.bottom + window.pageYOffset;
        return y >= bottom - grabSize;
    }

    var cursor = 0;

    function cursorListener(event) {
        // Swap the cursor when we are over the handle
        if (onHandle(event.pageX, event.pageY)) {
            if (cursor != 2) {
                element.style.cursor = 'pointer';
                cursor = 2;
            }
        } else {
            if (cursor != 1) {
                element.style.cursor = 'text';
                cursor = 1;
            }
        }
    }

    start();
}

export default ResizerActual;
