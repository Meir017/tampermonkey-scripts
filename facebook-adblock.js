// ==UserScript==
// @name         Facebook sponsored posts cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Meir Blachman
// @match        https://www.facebook.com/**/*
// @match        https://www.facebook.com/
// @match        https://www.facebook.com
// @grant        none
// ==/UserScript==

(function() {

    const strategties = [
        function strategy1() {
            const posts = document.querySelectorAll('[role="feed"] > div');
            for (let post of posts) {
                if (post.querySelector('a[href ^= "/ads/"]')) {
                    post.remove();
                }
            }
        }
    ]

    function intervalFunction() {
        for (let strategty of strategties) {
            strategty();
        }

        setTimeout(intervalFunction, 2500)
    }

    intervalFunction();
})();