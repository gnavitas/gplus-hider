// ==UserScript==
// @name         G+ Hider
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Hides Like buttons and Reaction counts on Facebook and Instagram with a togglable floating UI.
// @author       Antigravity
// @match        https://*.facebook.com/*
// @match        https://*.instagram.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==
(function() {
    'use strict';
    const safeGM_getValue = (key, defaultValue) => {
        if (typeof GM_getValue !== 'undefined') {
            try {
                return GM_getValue(key, defaultValue);
            } catch (e) {
            }
        }
        const val = localStorage.getItem('fbig_' + key);
        return val !== null ? JSON.parse(val) : defaultValue;
    };
    const safeGM_setValue = (key, value) => {
        if (typeof GM_setValue !== 'undefined') {
            try {
                GM_setValue(key, value);
                return;
            } catch (e) {
            }
        }
        localStorage.setItem('fbig_' + key, JSON.stringify(value));
    };
    const safeGM_addStyle = (css) => {
        if (typeof GM_addStyle !== 'undefined') {
            try {
                GM_addStyle(css);
                return;
            } catch (e) {
            }
        }
        const style = document.createElement('style');
        style.id = 'fbig-like-hider-styles-fallback';
        style.textContent = css;
        if (document.documentElement) {
            document.documentElement.appendChild(style);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.documentElement.appendChild(style);
            });
        }
    };
    safeGM_addStyle(`
        /* -------------------------------------------------------------
           LIKE HIDING BASE STYLES (using .class prefixes matching <html>)
           ------------------------------------------------------------- */
        /* --- Instagram --- */
        .fbig-hide-ig-btn .fbig-ig-like-btn {
            display: none !important;
        }
        /* CSS :has() selectors for instant hiding on Instagram */
        .fbig-hide-ig-btn button:has(svg[aria-label*="like" i]),
        .fbig-hide-ig-btn button:has(svg[aria-label*="unlike" i]),
        .fbig-hide-ig-btn [role="button"]:has(svg[aria-label*="like" i]),
        .fbig-hide-ig-btn [role="button"]:has(svg[aria-label*="unlike" i]) {
            display: none !important;
        }
        /* Direct CSS :has() selector targeting heart icon buttons on Instagram by path data */
        .fbig-hide-ig-btn button:has(svg:has(path[d^="M16.792" i])),
        .fbig-hide-ig-btn button:has(svg:has(path[d*="16.792" i])),
        .fbig-hide-ig-btn [role="button"]:has(svg:has(path[d^="M16.792" i])),
        .fbig-hide-ig-btn [role="button"]:has(svg:has(path[d*="16.792" i])) {
            display: none !important;
        }
        /* Direct SVG path match for heart icons on Instagram */
        .fbig-hide-ig-btn svg:has(path[d^="M16.792" i]),
        .fbig-hide-ig-btn svg:has(path[d*="16.792" i]) {
            display: none !important;
        }
        .fbig-hide-ig-count .fbig-ig-like-count {
            display: none !important;
        }
        .fbig-hide-ig-count a[href*="/liked_by" i],
        .fbig-hide-ig-count a[href*="/likes" i] {
            display: none !important;
        }
        /* Removed dangerous CSS wrapper selectors to prevent accidental hiding of comments */
        /* Instant CSS hiding for IG Reels counts (adjacent siblings of Like button) */
        .fbig-hide-ig-count button:has(svg[aria-label="Like" i]) + span,
        .fbig-hide-ig-count button:has(svg[aria-label="Unlike" i]) + span,
        .fbig-hide-ig-count [role="button"]:has(svg[aria-label="Like" i]) + span,
        .fbig-hide-ig-count [role="button"]:has(svg[aria-label="Unlike" i]) + span,
        .fbig-hide-ig-count button:has(svg[aria-label="Like" i]) + div,
        .fbig-hide-ig-count button:has(svg[aria-label="Unlike" i]) + div,
        .fbig-hide-ig-count [role="button"]:has(svg[aria-label="Like" i]) + div,
        .fbig-hide-ig-count [role="button"]:has(svg[aria-label="Unlike" i]) + div {
            display: none !important;
        }
        .fbig-hide-ig-count div:has(> [role="button"]:has(svg[aria-label="Like" i])) + span,
        .fbig-hide-ig-count div:has(> button:has(svg[aria-label="Unlike" i])) + span,
        .fbig-hide-ig-count div:has(> [role="button"]:has(svg[aria-label="Unlike" i])) + span,
        .fbig-hide-ig-count div:has(> button:has(svg[aria-label="Like" i])) + div,
        .fbig-hide-ig-count div:has(> [role="button"]:has(svg[aria-label="Like" i])) + div,
        .fbig-hide-ig-repost div:has(> button:has(svg[aria-label*="Save" i])) + div:not(:has(svg)),
        .fbig-hide-ig-repost div:has(> [role="button"]:has(svg[aria-label*="Save" i])) + div:not(:has(svg)) {
            display: none !important;
        }
        /* --- Instagram Comments --- */
        .fbig-hide-ig-comment .fbig-ig-comment-btn,
        .fbig-hide-ig-comment .fbig-ig-comment-section {
            display: none !important;
        }
        .fbig-hide-ig-comment button:has(svg[aria-label*="Comment" i]),
        .fbig-hide-ig-comment [role="button"]:has(svg[aria-label*="Comment" i]) {
            display: none !important;
        }
        .fbig-hide-ig-comment form:has(textarea) {
            display: none !important;
        }
        .fbig-hide-ig-comment div:has(> a[href*="/comments/" i]) {
            display: none !important;
        }
        .fbig-hide-ig-comment button:has(svg[aria-label*="Comment" i]) + span:not(:has(svg)),
        .fbig-hide-ig-comment [role="button"]:has(svg[aria-label*="Comment" i]) + span:not(:has(svg)),
        .fbig-hide-ig-comment button:has(svg[aria-label*="Comment" i]) + div:not(:has(svg)),
        .fbig-hide-ig-comment [role="button"]:has(svg[aria-label*="Comment" i]) + div:not(:has(svg)) {
            display: none !important;
        }
        .fbig-hide-ig-comment div:has(> button:has(svg[aria-label*="Comment" i])) + span:not(:has(svg)),
        .fbig-hide-ig-comment div:has(> [role="button"]:has(svg[aria-label*="Comment" i])) + span:not(:has(svg)),
        .fbig-hide-ig-comment div:has(> button:has(svg[aria-label*="Comment" i])) + div:not(:has(svg)),
        .fbig-hide-ig-comment div:has(> [role="button"]:has(svg[aria-label*="Comment" i])) + div:not(:has(svg)) {
            display: none !important;
        }
        .fbig-hide-ig-comment a[href*="/comments/" i] {
            display: none !important;
        }
        /* --- Instagram Repost --- */
        .fbig-hide-ig-repost .fbig-ig-repost-btn {
            display: none !important;
        }
        .fbig-hide-ig-repost button:has(svg[aria-label*="Repost" i]),
        .fbig-hide-ig-repost [role="button"]:has(svg[aria-label*="Repost" i]) {
            display: none !important;
        }
        /* --- Instagram Save --- */
        .fbig-hide-ig-save .fbig-ig-save-btn {
            display: none !important;
        }
        .fbig-hide-ig-save button:has(svg[aria-label="Save" i]),
        .fbig-hide-ig-save button:has(svg[aria-label="Remove" i]),
        .fbig-hide-ig-save [role="button"]:has(svg[aria-label="Save" i]),
        .fbig-hide-ig-save [role="button"]:has(svg[aria-label="Remove" i]) {
            display: none !important;
        }
        /* --- Facebook --- */
        .fbig-hide-fb-btn .fbig-fb-like-btn {
            display: none !important;
        }
        /* CSS :has() selectors for instant hiding on Facebook */
        .fbig-hide-fb-btn div[role="button"][aria-label="Like" i],
        .fbig-hide-fb-btn div[role="button"][aria-label="Unlike" i],
        .fbig-hide-fb-btn div[role="button"][aria-label="Remove Like" i],
        .fbig-hide-fb-btn div[role="button"][aria-label="Leave a reaction" i],
        .fbig-hide-fb-btn span[role="button"][aria-label="Like" i] {
            display: none !important;
        }
        /* Use visibility: hidden for FB reaction counts to keep layout and prevent Comments/Shares shifting */
        .fbig-hide-fb-count .fbig-fb-like-count {
            visibility: hidden !important;
            pointer-events: none !important;
        }
        .fbig-hide-fb-count span[role="toolbar" i],
        .fbig-hide-fb-count a[href*="reaction/profile" i],
        .fbig-hide-fb-count a[href*="ufi/reaction/profile" i],
        .fbig-hide-fb-count span[aria-label*="reaction" i],
        .fbig-hide-fb-count span[aria-label*="reacted" i],
        .fbig-hide-fb-count div[data-testid="fb-reactions-count" i] {
            visibility: hidden !important;
        }
        /* -------------------------------------------------------------
           FLOATING UI PANELS AND CONTROLS
           ------------------------------------------------------------- */
        #fbig-control-panel-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 2147483647; /* Highest z-index to overlay on FB/IG layers */
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            user-select: none;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        #fbig-toggle-btn {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1877f2 0%, #d6249f 50%, #fd5949 100%);
            border: none;
            color: white;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #fbig-toggle-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 22px rgba(0, 0, 0, 0.5);
        }
        #fbig-toggle-btn svg {
            width: 22px;
            height: 22px;
            filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
            stroke: #fff;
            fill: none;
        }
        #fbig-panel {
            width: 300px;
            background: rgba(18, 18, 22, 0.85);
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
            margin-bottom: 14px;
            overflow: hidden;
            display: none;
            flex-direction: column;
            transform: translateY(15px) scale(0.92);
            opacity: 0;
            transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            pointer-events: none;
        }
        #fbig-panel.expanded {
            display: flex;
            transform: translateY(0) scale(1);
            opacity: 1;
            pointer-events: auto;
        }
        #fbig-panel-header {
            padding: 14px 18px;
            background: rgba(255, 255, 255, 0.04);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        #fbig-panel-header h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.5px;
            background: linear-gradient(90deg, #1877f2 0%, #d6249f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-family: inherit;
        }
        #fbig-panel-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 22px;
            cursor: pointer;
            line-height: 1;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            transition: all 0.2s;
        }
        #fbig-panel-close:hover {
            color: white;
            background: rgba(255, 255, 255, 0.1);
        }
        .fbig-panel-content {
            padding: 18px;
        }
        .fbig-section-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .fbig-section-title.ig-title {
            color: #e1306c;
        }
        .fbig-section-title.fb-title {
            color: #1877f2;
        }
        .fbig-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            font-size: 13px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.95);
        }
        .fbig-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.08);
            margin: 14px 0;
        }
        /* --- Customized Toggle Switch --- */
        .fbig-toggle-switch {
            position: relative;
            display: inline-block;
            width: 42px;
            height: 22px;
        }
        .fbig-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .fbig-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(255, 255, 255, 0.15);
            transition: .25s;
            border-radius: 22px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .fbig-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .25s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        input:checked + .fbig-slider {
            background: linear-gradient(135deg, #1877f2 0%, #d6249f 100%);
            border-color: transparent;
        }
        input:checked + .fbig-slider:before {
            transform: translateX(20px);
        }
    `);
    const ttPolicy = window.trustedTypes && typeof window.trustedTypes.createPolicy === 'function'
        ? window.trustedTypes.createPolicy('fbig-hider-policy', { createHTML: (string) => string })
        : { createHTML: (string) => string };
    function updateBodyClasses() {
        const doc = document.documentElement;
        const hideIGAll = safeGM_getValue('hideIGAll', true);
        const hideIGRepost = safeGM_getValue('hideIGRepost', true);
        const hideIGSave = safeGM_getValue('hideIGSave', true);
        const hideIGComment = safeGM_getValue('hideIGComment', true);
        const hideFBBtn = safeGM_getValue('hideFBButton', true);
        const hideFBCnt = safeGM_getValue('hideFBCount', true);
        doc.classList.toggle('fbig-hide-ig-btn', hideIGAll);
        doc.classList.toggle('fbig-hide-ig-count', hideIGAll);
        doc.classList.toggle('fbig-hide-ig-repost', hideIGRepost);
        doc.classList.toggle('fbig-hide-ig-save', hideIGSave);
        doc.classList.toggle('fbig-hide-ig-comment', hideIGComment);
        doc.classList.toggle('fbig-hide-fb-btn', hideFBBtn);
        doc.classList.toggle('fbig-hide-fb-count', hideFBCnt);
    }
    updateBodyClasses();
    function registerMenuCommands() {
        GM_registerMenuCommand("Toggle FB Like Buttons", () => {
            const val = !safeGM_getValue('hideFBButton', true);
            safeGM_setValue('hideFBButton', val);
            const checkbox = document.getElementById('fbig-opt-fb-btn');
            if (checkbox) checkbox.checked = val;
            updateBodyClasses();
            scanForLikes();
        });
        GM_registerMenuCommand("Toggle FB Like/Reaction Counts", () => {
            const val = !safeGM_getValue('hideFBCount', true);
            safeGM_setValue('hideFBCount', val);
            const checkbox = document.getElementById('fbig-opt-fb-count');
            if (checkbox) checkbox.checked = val;
            updateBodyClasses();
            scanForLikes();
        });
        GM_registerMenuCommand("Toggle IG Likes & Counts", () => {
            const val = !safeGM_getValue('hideIGAll', true);
            safeGM_setValue('hideIGAll', val);
            const checkbox = document.getElementById('fbig-opt-ig-all');
            if (checkbox) checkbox.checked = val;
            updateBodyClasses();
            scanForLikes();
        });
        GM_registerMenuCommand("Toggle IG Repost", () => {
            const val = !safeGM_getValue('hideIGRepost', true);
            safeGM_setValue('hideIGRepost', val);
            const checkbox = document.getElementById('fbig-opt-ig-repost');
            if (checkbox) checkbox.checked = val;
            updateBodyClasses();
            scanForLikes();
        });
        GM_registerMenuCommand("Toggle IG Save", () => {
            const val = !safeGM_getValue('hideIGSave', true);
            safeGM_setValue('hideIGSave', val);
            const checkbox = document.getElementById('fbig-opt-ig-save');
            if (checkbox) checkbox.checked = val;
            updateBodyClasses();
            scanForLikes();
        });
        GM_registerMenuCommand("Toggle IG Comments", () => {
            const val = !safeGM_getValue('hideIGComment', true);
            safeGM_setValue('hideIGComment', val);
            const checkbox = document.getElementById('fbig-opt-ig-comment');
            if (checkbox) checkbox.checked = val;
            updateBodyClasses();
            scanForLikes();
        });
    }
    registerMenuCommands();
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    const scanForLikes = debounce(() => {
        const isIG = window.location.hostname.includes('instagram.com');
        const isFB = window.location.hostname.includes('facebook.com');
        if (isIG) {
            document.querySelectorAll('article section, main section').forEach(section => {
                const buttons = section.querySelectorAll('button, [role="button"]');
                if (buttons.length >= 3) {
                    const hasSvgs = Array.from(buttons).slice(0, 3).every(btn => btn.querySelector('svg'));
                    if (hasSvgs) {
                        buttons[0].classList.add('fbig-ig-like-btn');
                    }
                }
            });
            document.querySelectorAll('svg[aria-label*="like" i], svg[aria-label*="unlike" i]').forEach(svg => {
                const button = svg.closest('button, [role="button"]');
                if (button) button.classList.add('fbig-ig-like-btn');
            });
            document.querySelectorAll('svg path').forEach(path => {
                const d = path.getAttribute('d');
                if (d && (d.startsWith('M16.792') || d.includes('16.792') || d.includes('M8.3'))) {
                    const svg = path.closest('svg');
                    if (svg) {
                        const button = svg.closest('button, [role="button"]');
                        if (button) button.classList.add('fbig-ig-like-btn');
                    }
                }
            });
            document.querySelectorAll('a[href*="/liked_by" i], a[href*="/likes" i]').forEach(el => {
                el.classList.add('fbig-ig-like-count');
                if (el.parentElement && el.parentElement.tagName === 'DIV' && !el.parentElement.querySelector('button, svg') && el.parentElement.textContent.trim() === el.textContent.trim()) {
                    el.parentElement.classList.add('fbig-ig-like-count');
                }
            });
            document.querySelectorAll('span, div, a').forEach(el => {
                if (el.children.length === 0 && el.textContent) {
                    const text = el.textContent.trim().toLowerCase();
                    const isLikesText = /^[0-9,.]+[km]?\s*(likes?|views?|æ¬¡èµž|æ¬¡æ’­æ”¾|ì¢‹ì•„ìš”|ì¡°íšŒ|ã„ã„ã­ï¼|å†ç”Ÿå›žæ•°)$/.test(text) ||
                                        text.startsWith('liked by') || 
                                        text === 'likes' || text === 'views';
                    if (isLikesText) {
                        el.classList.add('fbig-ig-like-count');
                        let container = el.parentElement;
                        for (let i = 0; i < 3 && container && container !== document.body; i++) {
                            if (container.tagName === 'DIV' || container.tagName === 'SECTION') {
                                const hasButtons = container.querySelector('button, [role="button"], svg') !== null;
                                if (!hasButtons) {
                                    container.classList.add('fbig-ig-like-count');
                                    break;
                                }
                            }
                            container = container.parentElement;
                        }
                    }
                }
            });
            document.querySelectorAll('svg[aria-label="Like" i], svg[aria-label="Unlike" i]').forEach(svg => {
                let btn = svg.closest('button, [role="button"]');
                if (!btn) return;
                let next = btn.nextElementSibling;
                if (!next && btn.parentElement) next = btn.parentElement.nextElementSibling;
                if (!next && btn.parentElement && btn.parentElement.parentElement) next = btn.parentElement.parentElement.nextElementSibling;
                if (next && (next.tagName === 'DIV' || next.tagName === 'SPAN') && !next.querySelector('svg') && !next.querySelector('button, [role="button"]')) {
                    next.classList.add('fbig-ig-like-count');
                }
            });
            document.querySelectorAll('svg[aria-label*="Repost" i]').forEach(svg => {
                let btn = svg.closest('button, [role="button"]');
                if (btn) btn.classList.add('fbig-ig-repost-btn');
                const label = svg.getAttribute('aria-label') || '';
                if (label.toLowerCase().includes('repost')) {
                    if (!btn) return;
                    let next = btn.nextElementSibling;
                    if (!next && btn.parentElement) next = btn.parentElement.nextElementSibling;
                    if (!next && btn.parentElement && btn.parentElement.parentElement) next = btn.parentElement.parentElement.nextElementSibling;
                    if (next && (next.tagName === 'DIV' || next.tagName === 'SPAN') && !next.querySelector('svg') && !next.querySelector('button, [role="button"]')) {
                        next.classList.add('fbig-ig-repost-btn');
                    }
                }
            });
            document.querySelectorAll('svg[aria-label="Save" i], svg[aria-label="Remove" i]').forEach(svg => {
                let btn = svg.closest('button, [role="button"]');
                if (btn) btn.classList.add('fbig-ig-save-btn');
            });
            document.querySelectorAll('svg[aria-label*="Comment" i]').forEach(svg => {
                let btn = svg.closest('button, [role="button"]');
                if (btn) btn.classList.add('fbig-ig-comment-btn');
                if (!btn) return;
                let next = btn.nextElementSibling;
                if (!next && btn.parentElement) next = btn.parentElement.nextElementSibling;
                if (!next && btn.parentElement && btn.parentElement.parentElement) next = btn.parentElement.parentElement.nextElementSibling;
                if (next && (next.tagName === 'DIV' || next.tagName === 'SPAN') && !next.querySelector('svg') && !next.querySelector('button, [role="button"]')) {
                    next.classList.add('fbig-ig-comment-btn');
                }
            });
            const isSafeToHide = (el) => {
                if (!el || el === document.body || el.tagName === 'ARTICLE' || el.querySelector('article')) return false;
                if (el.querySelectorAll('svg').length >= 3) return false;
                return true;
            };
            document.querySelectorAll('form, textarea').forEach(el => {
                let p = el.closest('div') || el.closest('section');
                for (let i = 0; i < 4; i++) {
                    if (p && isSafeToHide(p)) p.classList.add('fbig-ig-comment-section');
                    if (p) p = p.parentElement;
                }
            });
            document.querySelectorAll('div, span, a').forEach(el => {
                if (el.children.length === 0 && el.textContent) {
                    const text = el.textContent.trim().toLowerCase();
                    if (text.startsWith('view all') && text.includes('comment')) {
                        let p = el.closest('div');
                        if (p && isSafeToHide(p)) {
                            p.classList.add('fbig-ig-comment-section');
                            let next = p.nextElementSibling;
                            while (next && next.tagName === 'DIV' && isSafeToHide(next)) {
                                next.classList.add('fbig-ig-comment-section');
                                next = next.nextElementSibling;
                            }
                        }
                    }
                    if (text === 'reply') {
                        let li = el.closest('li');
                        if (li && isSafeToHide(li)) {
                            li.classList.add('fbig-ig-comment-section');
                        } else {
                            let p = el.closest('div');
                            for (let i = 0; i < 4; i++) {
                                if (p && isSafeToHide(p)) p.classList.add('fbig-ig-comment-section');
                                if (p) p = p.parentElement;
                            }
                        }
                    }
                    if (text === 'add a comment...' || text.includes('no comments yet')) {
                        let p = el.closest('div');
                        for (let i = 0; i < 4; i++) {
                            if (p && isSafeToHide(p)) p.classList.add('fbig-ig-comment-section');
                            if (p) p = p.parentElement;
                        }
                    }
                }
            });
        }
        if (isFB) {
            document.querySelectorAll('div[role="button"], span[role="button"], button').forEach(btn => {
                const label = btn.getAttribute('aria-label');
                const text = btn.textContent ? btn.textContent.trim().toLowerCase() : '';
                const likeWords = ['like', 'j\'aime', 'me gusta', 'gefÃ¤llt mir', 'piace', 'Ð½Ñ€Ð°Ð²Ð¸Ñ‚ÑÑ', 'ì¢‹ì•„ìš”', 'ã„ã„ã­ï¼', 'unlike'];
                const isExactLikeText = likeWords.includes(text);
                const isLikeLabel = label && (likeWords.includes(label.toLowerCase()) || label.toLowerCase() === 'remove like' || label.toLowerCase() === 'leave a reaction');
                if (isExactLikeText || isLikeLabel) {
                    btn.classList.add('fbig-fb-like-btn');
                }
            });
            document.querySelectorAll('.fbig-fb-like-btn').forEach(likeBtn => {
                let actionsRow = likeBtn.parentElement;
                while (actionsRow && actionsRow !== document.body) {
                    const buttons = actionsRow.querySelectorAll('div[role="button"], span[role="button"], button');
                    if (buttons.length >= 2 && actionsRow.tagName === 'DIV') {
                        let metadataRow = actionsRow.previousElementSibling;
                        if (metadataRow) {
                            const reactionIcons = metadataRow.querySelectorAll('img, i, svg');
                            reactionIcons.forEach(icon => {
                                const src = icon.getAttribute('src') || '';
                                const style = icon.getAttribute('style') || '';
                                const ariaLabel = icon.getAttribute('aria-label') || '';
                                const isReaction = src.includes('reaction') || src.includes('emoji') || 
                                                   style.includes('reaction') || ariaLabel.toLowerCase().includes('reaction') ||
                                                   ariaLabel.toLowerCase().includes('like') || ariaLabel.toLowerCase().includes('love') ||
                                                   src.includes('fbcdn.net');
                                if (isReaction) {
                                    const reactionLink = icon.closest('a, [role="button"], span');
                                    if (reactionLink && !reactionLink.textContent.includes('comment') && !reactionLink.textContent.includes('share')) {
                                        reactionLink.classList.add('fbig-fb-like-count');
                                    }
                                }
                            });
                        }
                        break;
                    }
                    actionsRow = actionsRow.parentElement;
                }
            });
            document.querySelectorAll('a[href*="reaction/profile" i], a[href*="ufi/reaction/profile" i], span[role="toolbar" i]').forEach(el => {
                el.classList.add('fbig-fb-like-count');
                let container = el.parentElement;
                while (container && container !== document.body) {
                    if (container.tagName === 'DIV' || container.tagName === 'SPAN') {
                        const text = container.textContent.trim().toLowerCase();
                        const hasCommentsOrShares = text.includes('comment') || text.includes('share') || text.includes('è¯„è®º') || text.includes('ê³µìœ ') || text.includes('partage') || text.includes('compartir');
                        if (hasCommentsOrShares) {
                            break;
                        }
                        container.classList.add('fbig-fb-like-count');
                        break;
                    }
                    container = container.parentElement;
                }
            });
            document.querySelectorAll('img[src*="reaction"]').forEach(img => {
                let el = img.parentElement;
                while (el && el !== document.body) {
                    if (el.tagName === 'DIV' || el.tagName === 'SPAN') {
                        const text = el.textContent.trim().toLowerCase();
                        const hasCommentsOrShares = text.includes('comment') || text.includes('share') || text.includes('è¯„è®º') || text.includes('ê³µìœ ') || text.includes('partage') || text.includes('compartir');
                        if (hasCommentsOrShares) {
                            break;
                        }
                        el.classList.add('fbig-fb-like-count');
                        break;
                    }
                    el = el.parentElement;
                }
            });
        }
    }, 100);
    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldScan = true;
                break;
            }
        }
        if (shouldScan) {
            scanForLikes();
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('load', scanForLikes);
    window.addEventListener('scroll', scanForLikes);
    scanForLikes();
    function makeDraggable(elmnt, header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;
        header.ontouchstart = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event;
            if (e.target.closest('button') || e.target.closest('label') || e.target.closest('input')) {
                return;
            }
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            pos3 = clientX;
            pos4 = clientY;
            document.onmouseup = closeDragElement;
            document.ontouchend = closeDragElement;
            document.onmousemove = elementDrag;
            document.ontouchmove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;
            let newTop = elmnt.offsetTop - pos2;
            let newLeft = elmnt.offsetLeft - pos1;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const rect = elmnt.getBoundingClientRect();
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
            if (newLeft + rect.width > viewportWidth) newLeft = viewportWidth - rect.width;
            if (newTop + rect.height > viewportHeight) newTop = viewportHeight - rect.height;
            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";
            elmnt.style.bottom = "auto";
            elmnt.style.right = "auto";
            safeGM_setValue('panel_pos', { top: newTop, left: newLeft });
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.ontouchend = null;
            document.onmousemove = null;
            document.ontouchmove = null;
        }
    }
    function initUI() {
        if (document.getElementById('fbig-control-panel-container')) return;
        const container = document.createElement('div');
        container.id = 'fbig-control-panel-container';
        const pos = safeGM_getValue('panel_pos', null);
        if (pos) {
            container.style.top = pos.top + 'px';
            container.style.left = pos.left + 'px';
            container.style.bottom = 'auto';
            container.style.right = 'auto';
        }
        const uiHTML = `
            <div id="fbig-panel">
                <div id="fbig-panel-header">
                    <h3>FB & IG Like Hider</h3>
                    <button id="fbig-panel-close">&times;</button>
                </div>
                <div class="fbig-panel-content">
                    <div class="fbig-section-title ig-title">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        Instagram
                    </div>
                    <div class="fbig-option">
                        <span>Hide Likes & Counts</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-ig-all">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                    <div class="fbig-option">
                        <span>Hide Repost</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-ig-repost">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                    <div class="fbig-option">
                        <span>Hide Save</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-ig-save">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                    <div class="fbig-option">
                        <span>Hide Comments</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-ig-comment">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                    <div class="fbig-divider"></div>
                    <div class="fbig-section-title fb-title">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        Facebook
                    </div>
                    <div class="fbig-option">
                        <span>Hide Like Buttons</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-fb-btn">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                    <div class="fbig-option">
                        <span>Hide Reaction Counts</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-fb-count">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
            <button id="fbig-toggle-btn" title="Toggle Settings">
                <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="#fff" stroke-width="2.5" />
                </svg>
            </button>
        `;
        container.innerHTML = ttPolicy.createHTML(uiHTML);
        document.body.appendChild(container);
        const panel = document.getElementById('fbig-panel');
        const toggleBtn = document.getElementById('fbig-toggle-btn');
        const closeBtn = document.getElementById('fbig-panel-close');
        const header = document.getElementById('fbig-panel-header');
        const checkboxes = {
            hideIGAll: document.getElementById('fbig-opt-ig-all'),
            hideIGRepost: document.getElementById('fbig-opt-ig-repost'),
            hideIGSave: document.getElementById('fbig-opt-ig-save'),
            hideIGComment: document.getElementById('fbig-opt-ig-comment'),
            hideFBButton: document.getElementById('fbig-opt-fb-btn'),
            hideFBCount: document.getElementById('fbig-opt-fb-count')
        };
        for (const [key, element] of Object.entries(checkboxes)) {
            element.checked = safeGM_getValue(key, true);
            element.addEventListener('change', (e) => {
                safeGM_setValue(key, e.target.checked);
                updateBodyClasses();
                scanForLikes();
            });
        }
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('expanded');
        });
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.remove('expanded');
        });
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                panel.classList.remove('expanded');
            }
        });
        makeDraggable(container, header);
    }
    function checkBody() {
        if (document.body) {
            initUI();
        } else {
            setTimeout(checkBody, 50);
        }
    }
    checkBody();
})();

