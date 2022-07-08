// ==UserScript==
// @name         1337x magnet links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1337x torrent links
// @author       You
// @match        https://1337x.to/search/*
// @match        https://1337x.to/sort-search/*
// @match        https://1337xx.to/search/*
// @match        https://1337xx.to/sort-search/*
// @match        https://www.1337xxx.to/search/*
// @match        https://www.1337xxx.to/sort-search/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

var seeds = document.querySelector('th.coll-2');
var newHeader = document.createElement('th');
newHeader.innerText = 'ng';
seeds.parentNode.insertBefore(newHeader, seeds);

document.querySelectorAll('.search-page tbody tr').forEach(async element => {
    var link = Array.from(element.querySelectorAll('a')).find(x => x.href.includes('torrent'));
    var response = await fetch(link.href);
    var page = await response.text();
    var div = document.createElement('div');
    div.innerHTML = page;
    var magnetElement = div.querySelector('[href^=magnet]');

    var cell = document.createElement('td');
    cell.innerHTML = `<a href="${magnetElement.href}">${magnetElement.querySelector('.icon').innerHTML}</a>`;
    var name = element.querySelector('.coll-2');
    name.parentNode.insertBefore(cell, name);
});

})();