// ==UserScript==
// @name       Zhihu comment
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://www.zhihu.com/*
// @copyright  2012+, You
// ==/UserScript==

var doc = document,
    comments = [],
    cache = {};

GM_addStyle('.sunnylost-ref { left: 10px; }');

doc.addEventListener('DOMNodeInserted', checkCommentInsert);
addHandler( doc );

function checkCommentInsert(e) {
    var target = e.target;
    if(target && target.className && (target.className.indexOf('zm-comment-box') != -1 || target.className.indexOf('zm-item-comment') != -1)) {
        addHandler(target);
    }
}

function addHandler(root) {
    var i = 0,
        len,
        el,
        ref,
        id,
        links,
        link,
        name,
        tmp;
    comments = root.className == 'zm-item-comment' ? (i = comments.length, comments.push(root), comments) : comments.slice.call(root.querySelectorAll('.zm-item-comment'), 0);
    len = comments.length;

    for(; i < len; i++) {
        el = comments[i];
        id = el.dataset['id'];
        if(tmp = cache[id]) {
            if(tmp.className.indexOf('sunnylost-ref') != -1) {
                el.parentNode.removeChild(el);
            }
            continue;
        } else {
            cache[id] = el;
        }
        link = el.getElementsByClassName('zm-item-link-avatar')[0];
        comments[link.title || link.dataset['original_title']] = el;
        ref = el.querySelectorAll('.desc');
        if(!ref.length) continue;
        links = el.querySelectorAll('.zm-comment-hd .zg-link');
        link = links[links.length - 1];
        if(!link) continue;
        name = link.title || link.dataset && link.dataset['original_title'];
        if(!comments[name] || comments[name] === el) continue;
        comments[name].appendChild(el);
        el.className += ' sunnylost-ref';
    }
}
