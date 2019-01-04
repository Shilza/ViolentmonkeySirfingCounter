// ==UserScript==
// @name Counter
// @namespace Violentmonkey Scripts
// @match *://www.google.com/*
// @grant none
// @require https://code.jquery.com/jquery-1.12.4.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// ==/UserScript==
//

GM_addStyle('#counter-container {box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);transition: all 0.3s cubic-bezier(.25,.8,.25,1);');

GM_addStyle('#counter-container:hover { box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 3px 3px rgba(0,0,0,0.22);}');

GM_addStyle('.button {background-color: #4D90FE;background-image: -webkit-linear-gradient(top,#4d90fe,#4787ed);background-image: linear-gradient(top,#4d90fe,#4787ed);border: 1px solid #3079ED;color: white;}');

class Counter {

    /**
     * @param delay
     */
    constructor(delay) {
        this.delay = delay;
        this.counterSeconds = getTimeFromLocalStorage();
        this.toStorage = false;
        this.forcedStopped = false;
        this.timeChanger = () => {
            this.counterSeconds += 1;
            textCounter.textContent = convertTimeToString(this.counterSeconds);
            if(this.toStorage)
                localStorage.setItem(localStorageItemName, this.counterSeconds);
        }
    }

    /**
     * Method which access writing to local storage
     */
    writeToStorage() {
        if(!this.toStorage && !this.forcedStopped) {
            this.toStorage = true;
            this.reload();
        }
    }

    reload() {
        this.stop();
        this.start();
    }

    forcedStart() {
        this.forcedStopped = false;
        this.start();
    }

    forcedStop() {
        this.forcedStopped = true;
        this.stop();
    }

    start() {
        if (!this.intervalInstance && !this.forcedStopped) {
            this.stop();
            this.intervalInstance = setInterval(this.timeChanger, this.delay);
        }
    };

    stop() {
        if (this.intervalInstance) {
            clearInterval(this.intervalInstance);
            this.intervalInstance = null;
        }
    };
}

const localStorageItemName = 'counter';

let counterInstance = new Counter(1000);

/*
--------------------------------------------------
UI
--------------------------------------------------
*/
let counterContainer = document.createElement('div');
counterContainer.class = 'ui-widget-content';
counterContainer.style.position = 'fixed';
counterContainer.style.background = 'white';
counterContainer.style.left = '80%';
counterContainer.style.top = '15%';
counterContainer.style.padding = '1%';
counterContainer.style.borderRadius = '6%';
counterContainer.style.minWidth = '6%';
counterContainer.style.minHeight = '6%';

counterContainer.style.textAlign = 'center';
let textCounter = document.createElement('div');
textCounter.style.fontSize = '50px';

textCounter.innerHTML = convertTimeToString(counterInstance.counterSeconds);
let buttonsContainer = document.createElement('div');
buttonsContainer.style.display = 'flex';

buttonsContainer.style.justifyContent = 'space-around';
let resetButton = document.createElement('button');
resetButton.setAttribute('class', 'button');
resetButton.style.marginTop = '5%';
resetButton.style.cursor = 'pointer';

resetButton.textContent = 'Reset';

resetButton.onclick = function () {
    counterInstance.counterSeconds = 0;
};
let stopButton = document.createElement('button');
stopButton.setAttribute('class', 'button');
stopButton.style.marginTop = '5%';
stopButton.style.cursor = 'pointer';

stopButton.textContent = 'Stop';

stopButton.onclick = function () {
    if (!counterInstance.forcedStopped) {
        stopButton.textContent = 'Start';
        counterInstance.forcedStop();
    } else {
        stopButton.textContent = 'Stop';
        counterInstance.forcedStart()
    }
};
document.body.appendChild(counterContainer);
buttonsContainer.appendChild(resetButton);
buttonsContainer.appendChild(stopButton);
counterContainer.appendChild(textCounter);

counterContainer.appendChild(buttonsContainer);

/*
--------------------------------------------------
Logic
--------------------------------------------------
*/

/**
 * Main start function
 */
void async function () {
    await preStartTimeout(2000);
    setInterval(setupCounter, 2000);
}();


/**
 * Delay before launch to check if competing processes are running
 * @param ms
 * @returns {Promise<any>}
 */
function preStartTimeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)).then(setupCounter);
}

/**
 * Check if the resource is busy
 * @returns {boolean}
 */
function isBlocked() {
    return counterInstance.counterSeconds >= getTimeFromLocalStorage();
}

/**
 * Timer start function
 */
function setupCounter() {
    if(isBlocked())
        counterInstance.writeToStorage();

    counterInstance.start();
}

/**
 * Convert seconds to human normal view
 * @param time
 * @returns {string}
 */
function convertTimeToString(time) {
    const date = new Date(null);
    date.setSeconds(time);

    return date.toISOString().substr(11, 8);
}

/**
 * Getting data (seconds) from local storage
 * @returns {number}
 */
function getTimeFromLocalStorage() {
    return parseInt(localStorage.getItem(localStorageItemName)) ?
        parseInt(localStorage.getItem(localStorageItemName)) : 0;
}

/**
 * Helper for setting styles
 * @param css
 */
function GM_addStyle(css) {
    const style = document.getElementById('GM_addStyleBy8626') || (function () {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'GM_addStyleBy8626';
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

/**
 * jQuery method which makes container is draggable
 */
$(function () {
    $('#counter-container').draggable();
});
