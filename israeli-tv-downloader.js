// ==UserScript==
// @name         Israeli TV downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Meir Blachman
// @match        https://www.mako.co.il/**
// @match        https://13tv.co.il/**
// @match        https://kanapi.media.kan.org.il/Players/ByPlayer/V1/ipbc/*/HLS
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';
    const seenUrls = new Set();
    const contentTypes = new Set()
      .add('application/x-mpegurl')
      .add('application/x-mpegURL')
      .add('application/vnd.apple.mpegurl');

    (function (originalOpen) {

        function xhrHandler() {
            var contentType = this.getResponseHeader('content-type');
            if (contentTypes.has(contentType)) {
                if (!seenUrls.has(this.responseURL) && !seenUrls.has(document.title)) {
                    seenUrls.add(this.responseURL);
                    seenUrls.add(document.title);

                    var filename = document.title.replaceAll(':', '-').replaceAll('"','') + '.mp4';

                    const downloadVideoCommand = `youtube-dl "${this.responseURL}" --user-agent "${navigator.userAgent}" -o "${filename}" -f best --fragment-retries infinite`;
                    GM_setClipboard(downloadVideoCommand);
                    alert(downloadVideoCommand);
                }
            }
        }

        XMLHttpRequest.prototype.open = function () {
            this.addEventListener("readystatechange", xhrHandler, false);
            originalOpen.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
})();