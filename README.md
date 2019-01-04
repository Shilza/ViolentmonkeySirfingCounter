# ViolentmonkeySirfingCounter
Violentmonkey script that helps you keep track of surfing time

### To use this script, you need:
1. Install [Violentmonkey extension](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) for your favorite browser.
2. Open dashboard and create new script.
3. Copy code from [index.js](https://github.com/Shilza/ViolentmonkeySirfingCounter/blob/master/index.js) and paste it into the script.
4. Enable scripts in the control panel of Violentmonkey.

To change the site for counting the time of surfing, you can change the field ***@match*** with to any regular expression.

```js
// ==UserScript==
// @name Counter
// @namespace Violentmonkey Scripts
***// @match *://www.google.com/*
// @grant none
// @require https://code.jquery.com/jquery-1.12.4.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// ==/UserScript==
``` 
