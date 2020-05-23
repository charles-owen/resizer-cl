
export function ResizerActual(element, options) {
    element.classList.add('resizer');

    // Timeout period for animated resizing
    const timeoutPeriod = 20;

    //
    // Handle options
    //
    let grabSize = options.grabSize;

    let handle = options.handle;
    if(handle === 'bar') {
        element.style.resize = 'none';
        element.style.borderBottom = grabSize + 'px solid #18453B';
    } else if(handle === 'handle') {
        element.style.resize = 'vertical';
    } else if(handle === 'none') {

    } else {
        element.style.resize = 'none';
        element.style.borderBottom = handle;
    }

    /// Are mouse move event handlers installed?
    let installedMouseListeners = false;

    /// Are touch move event handlers installed?
    let installedTouchListeners = false;

    let mask = null;

    /// Get the minimum height and width properties
    const rect = element.getBoundingClientRect();
    let height = rect.height;
    let width = rect.width;

    let minHeight = getComputedStyle(element).minHeight;
    minHeight = minHeight.substr(0, minHeight.length - 2);
    let minWidth = getComputedStyle(element).minWidth;
    minWidth = minWidth.substr(0, minWidth.length - 2);

    let timer = null;

    let targetWidth = null;
    let targetHeight = null;

    function start() {
        // Install the mouse down and touch start listeners
        element.addEventListener('mousedown', mouseDownListener);
        element.addEventListener('touchstart', touchStartListener);

        // Install the cursor listener
        // This swaps the cursor when we hover the mouse over the grab bar
        element.addEventListener('mousemove', cursorListener);
    }

    function setTarget(tw, th) {
        targetWidth = tw;
        targetHeight = th;

        // If a timer is not active, create one.
        if(timer === null) {
            timerMover();
        }
    }

    function timerMover() {
        timer = null;

        const maxPixels = options.maxSpeed * timeoutPeriod / 1000;

        if(targetHeight !== null) {
            const currentHeight = +height;
            let diff = targetHeight - currentHeight;

            if(Math.abs(diff) > maxPixels) {
                diff = diff < 0 ? -maxPixels : maxPixels;
                height = currentHeight + diff;

                element.style.height = '' + height + 'px';
            } else {
                // Not rate limited
                height = targetHeight;
                element.style.height = '' + height + 'px';
                targetHeight = null;
            }
        }

        if(targetWidth !== null) {
            const currentWidth = +width;
            let diff = targetWidth - currentWidth;

            if(Math.abs(diff) > maxPixels) {
                diff = diff < 0 ? -maxPixels : maxPixels;
                width = currentWidth + diff;

                element.style.width = '' + width + 'px';
            } else {
                // Not rate limited
                width = targetWidth;
                element.style.width = '' + width + 'px';
                targetWidth = null;
            }
        }

        if(targetHeight !== null || targetWidth !== null) {
            timer = setTimeout(timerMover, timeoutPeriod);
        }

    }

    let initialX, initialY;
    let initialWidth, initialHeight;
    let grabType = null;

    /**
     * Start the resizing on a mouse down or touch
     * @param x Mouse or touch X in pixels
     * @param y Mouse or touch Y in pixels
     */
    function moveStart(x, y) {
        initialX = x;
        initialY = y;
        let rect = element.getBoundingClientRect();
        width = +element.clientWidth;
        initialWidth = width;
        height = +element.clientHeight;
        initialHeight = height;
        targetWidth = null;
        targetHeight = null;
    }

    /**
     * Handle a mouse or finger move to a new position,
     * resulting in a resize request.
     * @param x Mouse or touch X in pixels
     * @param y Mouse or touch Y in pixels
     */
    function moveTo(x, y) {
        let dx = x - initialX;
        let dy = y - initialY;

        let newWidth = null;
        let newHeight = null;

        if(grabType === 'horizontal' || grabType === 'both') {
            // Compute a desired new width
            newWidth = initialWidth + dx;
            if (newWidth < minWidth) {
                newWidth = minWidth;
            }

        }

        if(grabType === 'vertical' || grabType === 'both') {
            const wasHeight = element.offsetHeight;

            // Compute a desired new height
            newHeight = initialHeight + dy;
            if (newHeight < minHeight) {
                newHeight = minHeight;
            }

        }

        setTarget(newWidth, newHeight);
    }

    //
    // Mouse Handling
    //

    function mouseDownListener(e) {
        const x = e.pageX;
        const y = e.pageY;

        grabType = onHandle(x, y, false);
        if(grabType !== null) {
            e.stopPropagation();
            e.preventDefault();

            moveStart(x, y);

            installMask();
            installMouseHandlers();
        }
    }

    function mouseMoveListener(e) {
        e.stopPropagation();
        e.preventDefault();

        if (e.buttons !== 1) {
            removeAll();
            return;
        }

        moveTo(e.pageX, e.pageY);
    }

    function mouseUpListener(e) {
        removeAll();
    }

    function installMouseHandlers() {
        removeHandlers();

        installedMouseListeners = true;
        document.addEventListener('mousemove', mouseMoveListener, false);
        document.addEventListener('mouseup', mouseUpListener, false);
    }

    //
    // Touch Handling
    //

    function touchStartListener(e) {
        const x = e.touches[0].pageX;
        const y = e.touches[0].pageY;

        grabType = onHandle(x, y, true);
        if(grabType !== null) {
            e.stopPropagation();
            e.preventDefault();

            moveStart(x, y);

            installMask();
            installTouchHandlers();
        }
    }

    function touchMoveListener(e) {
        e.stopPropagation();
        //e.preventDefault();

        const x = e.touches[0].pageX;
        const y = e.touches[0].pageY;

        moveTo(x, y);
    }

    function touchEndListener(e) {
        removeAll();
    }

    function installTouchHandlers() {
        removeHandlers();

        installedTouchListeners = true;
        document.addEventListener('touchmove', touchMoveListener);
        document.addEventListener('touchend', touchEndListener);
        document.addEventListener('touchcancel', touchEndListener);
    }

    //
    // Mask
    //

    function installMask() {
        if(!options.useMask) {
            return;
        }

        // Ensure none currently exists
        removeMask();

        let body = document.querySelector('body');
        mask = document.createElement('div');

        mask.style.position = 'fixed';
        mask.style.left = 0;
        mask.style.top = 0;
        mask.style.width = "100%";
        mask.style.height = '100%';
        mask.style.backgroundColor = 'transparent';
        mask.style.zIndex = 10000;
        mask.style.opacity = 0.5;
        mask.style.cursor = 'pointer';

        body.appendChild(mask);
    }

    function removeAll() {
        if(timer !== null) {
            clearTimeout(timer);
            timer = null;
        }

        removeHandlers();
        removeMask();
    }

    function removeHandlers() {
        if(installedMouseListeners) {
            document.removeEventListener('mousemove', mouseMoveListener);
            document.removeEventListener('mouseup', mouseUpListener);
            installedMouseListeners = false;
        }

        if(installedTouchListeners) {
            document.removeEventListener('touchmove', touchMoveListener);
            document.removeEventListener('touchend', touchEndListener);
            document.removeEventListener('touchcancel', touchEndListener);
            installedTouchListeners = false;
        }
    }

    function removeMask() {
        if(mask !== null) {
            const body = document.querySelector('body');
            body.removeChild(mask);
            mask = null;
        }
    }

    /**
     * Determine if an x,y location is over a handle for manipulating
     * the resizeable object.
     * @param x location in pixels
     * @param y location in pixels
     * @returns string|null if not, 'horizontal', 'vertical', 'both' if over handle and mode available.
     */
    function onHandle(x, y, touch) {
        let rect = element.getBoundingClientRect();

        const slop = touch ? 10 : 0;

        let bottom = rect.bottom + window.pageYOffset;
        let vert = y >= bottom - grabSize - slop;

        let right = rect.right + window.pageXOffset;
        let horz = x >= right - grabSize - slop;

        if(options.resize === 'both') {
            if(vert && horz) {
                return 'both';
            }
            if(vert) {
                return 'vertical';
            }

            if(horz) {
                return 'horizontal';
            }
        }

        if((options.resize === 'both' || options.resize === 'vertical') && vert) {
            return 'vertical';
        }

        if((options.resize === 'both' || options.resize === 'horizontal') && horz) {
            return 'horizontal';
        }

        return null;
    }



    let cursor = 0;

    function cursorListener(event) {
        // Swap the cursor when we are over the handle
        if (onHandle(event.pageX, event.pageY, false) !== null) {
            if (cursor !== 2) {
                element.style.cursor = 'pointer';
                cursor = 2;
            }
        } else {
            if (cursor !== 1) {
                element.style.cursor = 'text';
                cursor = 1;
            }
        }
    }

    start();
}
