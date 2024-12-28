// ==UserScript==
// @name         Israeli TV downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Meir Blachman
// @match        https://www.mako.co.il/**
// @match        https://13tv.co.il/**
// @match        https://kanapi.media.kan.org.il/Players/ByPlayer/V1/ipbc/*/HLS
// @match        https://www.kan.org.il/content/kan/kan-11/**
// @match        https://play.hot.net.il/**
// @match        https://vod.walla.co.il/**
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
            } else if (isHotGetVideoRequest.apply(this)) {
                extractHotVideoUrl.apply(this);
            }
        }

        function isHotGetVideoRequest() {
            return this.responseURL && this.responseText && this.responseURL.endsWith('htService.asmx/getUniqeURL');
        }

        function extractHotVideoUrl() {
            /* 
             * for https://play.hot.net.il responses looks like:
             * 
             * '{"d":"{\\"error\\":{\\"iCode\\":\\"0\\",\\"IReason\\":\\"\\",\\"sMsg\\":\\"\\"},\\"Url\\":\\"https://pta1-cdn-edge-vod00.cdnhot.co.il/vodplaytv-PTA1.cdnhot.co.il/sid=25749-1657273316-213.57.6.64-333/shls/PZ896001/10.m3u8?Client_version=3\\u0026device=APPCDNDRMVOD\\u0026IS=0\\u0026ET=1657273376\\u0026CIP=2.54.179.162\\u0026KO=1\\u0026KN=1\\u0026US=23aba4e7f55712659864343adad703f6\\"}"}'
             * 
             * after using 'JSON.parse' we get an object with a single property called 'd'
             * the value of 'd' is a json string we need to parse again
             * 
             * we get a string looking like the following:
             * '{"error":{"iCode":"0","IReason":"","sMsg":""},"Url":"https://pta1-cdn-edge-vod00.cdnhot.co.il/vodplaytv-PTA1.cdnhot.co.il/sid=25749-1657273316-213.57.6.64-333/shls/PZ896001/10.m3u8?Client_version=3&device=APPCDNDRMVOD&IS=0&ET=1657273376&CIP=2.54.179.162&KO=1&KN=1&US=23aba4e7f55712659864343adad703f6"}'
             * 
             * after using 'JSON.parse' we get an object with multiple properties, the interesting one is 'Url' which is the download url we will pass to 'youtube-dl'
             */
            try {
                const jsonResponse = JSON.parse(this.responseText);
                const response = JSON.parse(jsonResponse.d);

                // verify no error
                if (response.error.iCode === '0') {
                    const filename = 'HOT video'; // TODO: extract the actual filename
                    const downloadUrl = response.Url;
                    const downloadVideoCommand = `youtube-dl "${downloadUrl}" --user-agent "${navigator.userAgent}" -o "${filename}" -f best --fragment-retries infinite`;
                    GM_setClipboard(downloadVideoCommand);
                    alert(downloadVideoCommand);
                }
            } catch (e) { }
        }

        XMLHttpRequest.prototype.open = function () {
            this.addEventListener("readystatechange", xhrHandler, false);
            originalOpen.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
})();
