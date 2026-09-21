// ==UserScript==
// @name         G+ Social Media Button Hider
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Hides Like buttons and Reaction counts on Facebook, Instagram, TikTok, and X.
// @author       Antigravity
// @match        https://*.facebook.com/*
// @match        https://*.instagram.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.x.com/*
// @match        *://*.twitter.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
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
        html.fbig-hide-ig-count .fbig-ig-like-count {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            font-size: 0 !important;
            pointer-events: none !important;
        }
        .fbig-hide-ig-count a[href*="/liked_by" i],
        .fbig-hide-ig-count a[href*="/likes" i] {
            display: none !important;
        }
        /* Removed dangerous CSS wrapper selectors to prevent accidental hiding of comments */
        /* --- Instagram Repost --- */
        html.fbig-hide-ig-repost .fbig-ig-repost-btn {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            font-size: 0 !important;
            pointer-events: none !important;
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
        .fbig-hide-ig-save button:has(svg[aria-label="Remove" i]),
        .fbig-hide-ig-save [role="button"]:has(svg[aria-label="Save" i]),
        .fbig-hide-ig-save [role="button"]:has(svg[aria-label="Remove" i]) {
            display: none !important;
        }
        /* --- Instagram Comments --- */
        html.fbig-hide-ig-comments .fbig-ig-comment-btn,
        html.fbig-hide-ig-comments .fbig-ig-comment-section {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            height: 0 !important;
            width: 0 !important;
            font-size: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        .fbig-hide-ig-comments button:has(svg[aria-label="Comment" i]),
        .fbig-hide-ig-comments [role="button"]:has(svg[aria-label="Comment" i]) {
            display: none !important;
        }
        /* --- TikTok --- */
        html.fbig-hide-tiktok-btn [data-e2e*="like-icon" i],
        html.fbig-hide-tiktok-btn [data-e2e*="like-icon" i] ~ strong,
        html.fbig-hide-tiktok-btn [data-e2e*="like-icon" i] ~ span,
        html.fbig-hide-tiktok-btn button:has([data-e2e*="like-icon" i]),
        html.fbig-hide-tiktok-btn button:has([data-e2e*="like-icon" i]) ~ strong,
        html.fbig-hide-tiktok-btn button:has([data-e2e*="like-icon" i]) ~ span,
        html.fbig-hide-tiktok-btn div:has(> [data-e2e*="like-icon" i]),
        html.fbig-hide-tiktok-btn div:has(> [data-e2e*="like-icon" i]) ~ strong,
        html.fbig-hide-tiktok-btn div:has(> [data-e2e*="like-icon" i]) ~ span,
        html.fbig-hide-tiktok-btn *:not(html).fbig-hide-tiktok-btn {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        html.fbig-hide-tiktok-comments [data-e2e*="comment-icon" i],
        html.fbig-hide-tiktok-comments [data-e2e*="comment-icon" i] ~ strong,
        html.fbig-hide-tiktok-comments [data-e2e*="comment-icon" i] ~ span,
        html.fbig-hide-tiktok-comments button:has([data-e2e*="comment-icon" i]),
        html.fbig-hide-tiktok-comments button:has([data-e2e*="comment-icon" i]) ~ strong,
        html.fbig-hide-tiktok-comments button:has([data-e2e*="comment-icon" i]) ~ span,
        html.fbig-hide-tiktok-comments div:has(> [data-e2e*="comment-icon" i]),
        html.fbig-hide-tiktok-comments div:has(> [data-e2e*="comment-icon" i]) ~ strong,
        html.fbig-hide-tiktok-comments div:has(> [data-e2e*="comment-icon" i]) ~ span,
        html.fbig-hide-tiktok-comments [data-e2e*="comment-level" i],
        html.fbig-hide-tiktok-comments [data-e2e*="comment-list" i],
        html.fbig-hide-tiktok-comments [data-e2e*="search-comment" i],
        html.fbig-hide-tiktok-comments [class*="DivCommentContainer"],
        html.fbig-hide-tiktok-comments [class*="CommentListContainer"],
        html.fbig-hide-tiktok-comments [class*="DivBottomCommentContainer"],
        html.fbig-hide-tiktok-comments *:not(html).fbig-hide-tiktok-comments {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* --- X.com (Twitter) --- */
        html.fbig-hide-x-btn [data-testid="like"],
        html.fbig-hide-x-btn [data-testid="unlike"],
        html.fbig-hide-x-btn *:not(html).fbig-hide-x-btn {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        html.fbig-hide-x-comments [data-testid="reply"],
        html.fbig-hide-x-comments *:not(html).fbig-hide-x-comments {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        html.fbig-hide-x-repost [data-testid="retweet"],
        html.fbig-hide-x-repost *:not(html).fbig-hide-x-repost {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
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
        .fbig-hide-fb-count a[href*="reaction/profile" i],
        .fbig-hide-fb-count a[href*="ufi/reaction/profile" i],
        .fbig-hide-fb-count span[aria-label*="reaction" i],
        .fbig-hide-fb-count span[aria-label*="reacted" i],
        .fbig-hide-fb-count div[data-testid="fb-reactions-count" i] {
            visibility: hidden !important;
        }
        /* --- Facebook Comments --- */
        .fbig-hide-fb-comments .fbig-fb-comment-btn,
        .fbig-hide-fb-comments .fbig-fb-comment-section {
            display: none !important;
        }
        /* -------------------------------------------------------------
           FLOATING UI PANELS AND CONTROLS
           ------------------------------------------------------------- */
        #fbig-control-panel-container {
            position: fixed !important;
            bottom: 24px !important;
            top: auto !important;
            right: 24px !important;
            z-index: 2147483647 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            user-select: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-end !important;
            pointer-events: none !important;
        }
        #fbig-control-panel-container * {
            pointer-events: auto;
        }
        #fbig-toggle-btn {
            width: 18px !important;
            height: 18px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid #ddd !important;
            border-radius: 8px !important;
            color: #333 !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            padding: 0 !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        @media (prefers-color-scheme: dark) {
            #fbig-toggle-btn {
                background: #242526 !important;
                border-color: #3e4042 !important;
                color: #e4e6eb !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
            }
        }
        #fbig-toggle-btn:hover {
            transform: scale(1.1) !important;
        }
        #fbig-panel {
            width: 300px !important;
            background: rgba(18, 18, 22, 0.85) !important;
            backdrop-filter: blur(16px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            border-radius: 16px !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5) !important;
            margin-top: 14px !important;
            overflow: hidden !important;
            display: none !important;
            flex-direction: column !important;
            transform: translateY(-15px) scale(0.92) !important;
            opacity: 0 !important;
            transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            pointer-events: none !important;
        }
        #fbig-panel.expanded {
            display: flex !important;
            transform: translateY(0) scale(1) !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        #fbig-panel-header {
            padding: 14px 18px !important;
            background: rgba(255, 255, 255, 0.04) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            cursor: move !important;
        }
        #fbig-panel-header h3 {
            margin: 0 !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            letter-spacing: 0.5px !important;
            background: linear-gradient(90deg, #1877f2 0%, #d6249f 100%) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            font-family: inherit !important;
        }
        #fbig-panel-close {
            background: none !important;
            border: none !important;
            color: rgba(255, 255, 255, 0.5) !important;
            font-size: 22px !important;
            cursor: pointer !important;
            line-height: 1 !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 24px !important;
            height: 24px !important;
            border-radius: 50% !important;
            transition: all 0.2s !important;
        }
        #fbig-panel-close:hover {
            color: white !important;
            background: rgba(255, 255, 255, 0.1) !important;
        }
        .fbig-panel-content {
            padding: 18px !important;
        }
        .fbig-section-title {
            font-size: 11px !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 1.2px !important;
            margin-bottom: 12px !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
        }
        .fbig-section-title.ig-title {
            color: #e1306c !important;
        }
        .fbig-section-title.fb-title {
            color: #1877f2 !important;
        }
        .fbig-option {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 14px !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            color: rgba(255, 255, 255, 0.95) !important;
        }
        .fbig-divider {
            height: 1px !important;
            background: rgba(255, 255, 255, 0.08) !important;
            margin: 14px 0 !important;
        }
        /* --- Customized Toggle Switch --- */
        .fbig-toggle-switch {
            position: relative !important;
            display: inline-block !important;
            width: 42px !important;
            height: 22px !important;
        }
        .fbig-toggle-switch input {
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
        }
        .fbig-slider {
            position: absolute !important;
            cursor: pointer !important;
            top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
            background-color: rgba(255, 255, 255, 0.15) !important;
            transition: .25s !important;
            border-radius: 22px !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
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
    let ttPolicy = { createHTML: (string) => string };
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            ttPolicy = window.trustedTypes.createPolicy('fbig-hider-policy-' + Math.floor(Math.random() * 1000000), { createHTML: (string) => string });
        } catch (e) {
            // Fallback if policy creation fails
        }
    }
    function updateBodyClasses() {
        const doc = document.documentElement;
        const hideIGAll = safeGM_getValue('hideIGAll', true);
        const hideIGComments = safeGM_getValue('hideIGComments', false);
        const hideIGRepost = safeGM_getValue('hideIGRepost', true);
        const hideIGSave = safeGM_getValue('hideIGSave', true);
        const hideFBBtn = safeGM_getValue('hideFBButton', true);
        const hideFBCnt = safeGM_getValue('hideFBCount', true);
        const hideFBComments = safeGM_getValue('hideFBComments', false);
        const hideTikTokBtn = safeGM_getValue('hideTikTokBtn', false);
        const hideTikTokComments = safeGM_getValue('hideTikTokComments', false);
        const hideXBtn = safeGM_getValue('hideXBtn', false);
        const hideXComments = safeGM_getValue('hideXComments', false);
        const hideXRepost = safeGM_getValue('hideXRepost', false);
        doc.classList.toggle('fbig-hide-ig-btn', hideIGAll);
        doc.classList.toggle('fbig-hide-ig-count', hideIGAll);
        doc.classList.toggle('fbig-hide-ig-comments', hideIGComments);
        doc.classList.toggle('fbig-hide-ig-repost', hideIGRepost);
        doc.classList.toggle('fbig-hide-ig-save', hideIGSave);
        doc.classList.toggle('fbig-hide-fb-btn', hideFBBtn);
        doc.classList.toggle('fbig-hide-fb-count', hideFBCnt);
        doc.classList.toggle('fbig-hide-fb-comments', hideFBComments);
        doc.classList.toggle('fbig-hide-tiktok-btn', hideTikTokBtn);
        doc.classList.toggle('fbig-hide-tiktok-comments', hideTikTokComments);
        doc.classList.toggle('fbig-hide-x-btn', hideXBtn);
        doc.classList.toggle('fbig-hide-x-comments', hideXComments);
        doc.classList.toggle('fbig-hide-x-repost', hideXRepost);
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
        GM_registerMenuCommand("Toggle TikTok Like Buttons", () => {
            const val = !safeGM_getValue('hideTikTokBtn', false);
            safeGM_setValue('hideTikTokBtn', val);
            const checkbox = document.getElementById('fbig-opt-tiktok-btn');
            if (checkbox) checkbox.checked = val;
            updateBodyClasses();
            scanForLikes();
        });
        GM_registerMenuCommand("Toggle TikTok Comments", () => {
            const val = !safeGM_getValue('hideTikTokComments', false);
            safeGM_setValue('hideTikTokComments', val);
            const checkbox = document.getElementById('fbig-opt-tiktok-comments');
            if (checkbox) checkbox.checked = val;
            updateBodyClasses();
            scanForLikes();
        });
        GM_registerMenuCommand("Toggle X Like Buttons", () => {
            const val = !safeGM_getValue('hideXBtn', false);
            safeGM_setValue('hideXBtn', val);
            const checkbox = document.getElementById('fbig-opt-x-btn');
            if (checkbox) checkbox.checked = val;
            updateBodyClasses();
            scanForLikes();
        });
        GM_registerMenuCommand("Toggle X Comments", () => {
            const val = !safeGM_getValue('hideXComments', false);
            safeGM_setValue('hideXComments', val);
            const checkbox = document.getElementById('fbig-opt-x-comments');
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
        const isTikTok = window.location.hostname.includes('tiktok.com');
        const isX = window.location.hostname.includes('x.com') || window.location.hostname.includes('twitter.com');
        
        if (isX && document.documentElement.classList.contains('fbig-hide-x-comments') && window.location.pathname.includes('/status/')) {
            // Very aggressive X comment feed hider: Hide any tweet in a conversational timeline that isn't the first main tweet
            let timelines = document.querySelectorAll('div[aria-label*="Timeline: Conversation" i]');
            timelines.forEach(timeline => {
                let cells = Array.from(timeline.querySelectorAll('div[data-testid="cellInnerDiv"]'));
                let foundActionRow = false;
                cells.forEach(cell => {
                    // Action row usually contains retweets, likes, bookmarks. Once we pass it, we are in the comments section.
                    if (!foundActionRow && (cell.querySelector('[data-testid="retweet"]') || cell.querySelector('[data-testid="like"]') || cell.querySelector('[data-testid="unlike"]'))) {
                        foundActionRow = true;
                    } else if (foundActionRow) {
                        cell.classList.add('fbig-hide-x-comments');
                    }
                });
            });
        }
        
        if (isTikTok) {
            document.querySelectorAll('[data-e2e*="like-icon" i]').forEach(icon => {
                let btn = icon.closest('button, [role="button"]') || icon.parentElement;
                if (btn) btn.classList.add('fbig-hide-tiktok-btn');
                let next = icon.nextElementSibling || (btn && btn.nextElementSibling);
                if (next && (next.tagName === 'STRONG' || next.tagName === 'SPAN')) next.classList.add('fbig-hide-tiktok-btn');
            });
            document.querySelectorAll('[data-e2e*="comment-icon" i]').forEach(icon => {
                let btn = icon.closest('button, [role="button"]') || icon.parentElement;
                if (btn) btn.classList.add('fbig-hide-tiktok-comments');
                let next = icon.nextElementSibling || (btn && btn.nextElementSibling);
                if (next && (next.tagName === 'STRONG' || next.tagName === 'SPAN')) next.classList.add('fbig-hide-tiktok-comments');
            });
            document.querySelectorAll('span, div, strong').forEach(el => {
                if (el.children.length === 0 && el.textContent) {
                    const text = el.textContent.trim();
                    if (/^[0-9,.]+[km]?$/i.test(text)) {
                        let btn = el.previousElementSibling;
                        if (btn && (btn.tagName === 'BUTTON' || btn.getAttribute('role') === 'button' || btn.querySelector('svg'))) {
                            if (btn.querySelector('[data-e2e*="like-icon" i]')) {
                                el.classList.add('fbig-hide-tiktok-btn');
                            } else if (btn.querySelector('[data-e2e*="comment-icon" i]')) {
                                el.classList.add('fbig-hide-tiktok-comments');
                            }
                        }
                    }
                }
            });
        }
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
            });
            document.querySelectorAll('svg[aria-label*="Like" i], svg[aria-label*="Unlike" i]').forEach(svg => {
                let btn = svg.closest('button, [role="button"], a') || svg;
                
                // If it's a tiny heart, it's a comment like button. Hide the whole comment!
                if (svg.getAttribute('width') === '12' || svg.getAttribute('height') === '12' || svg.clientWidth < 18) {
                    let li = svg.closest('li') || svg.closest('div[role="listitem"]');
                    if (li) {
                        li.classList.add('fbig-ig-comment-section');
                    } else {
                        let c = svg.parentElement;
                        for(let i=0; i<6 && c && c !== document.body; i++) {
                            // Find the content column, and hide it and its previous sibling (the avatar column)
                            if (c.previousElementSibling && c.previousElementSibling.querySelector('img')) {
                                c.classList.add('fbig-ig-comment-section');
                                c.previousElementSibling.classList.add('fbig-ig-comment-section');
                                if (c.parentElement) c.parentElement.classList.add('fbig-ig-comment-section');
                                break;
                            }
                            c = c.parentElement;
                        }
                    }
                }

                if (btn.parentElement && btn.parentElement.textContent.trim().match(/^[0-9,.]+[km]?$/i)) {
                    btn.parentElement.classList.add('fbig-ig-like-count');
                } else {
                    let next = btn.nextElementSibling;
                    if (next && next.textContent && /^[0-9,.]+[km]?$/i.test(next.textContent.trim())) next.classList.add('fbig-ig-like-count');
                    let pNext = btn.parentElement ? btn.parentElement.nextElementSibling : null;
                    if (pNext && pNext.textContent && /^[0-9,.]+[km]?$/i.test(pNext.textContent.trim())) pNext.classList.add('fbig-ig-like-count');
                }
            });
            document.querySelectorAll('svg[aria-label="Comment" i]').forEach(svg => {
                let btn = svg.closest('button, [role="button"], a') || svg;
                btn.classList.add('fbig-ig-comment-btn');
                if (btn.parentElement && btn.parentElement.textContent.trim().match(/^[0-9,.]+[km]?$/i)) {
                    btn.parentElement.classList.add('fbig-ig-comment-btn');
                } else {
                    let next = btn.nextElementSibling;
                    if (next && next.textContent && /^[0-9,.]+[km]?$/i.test(next.textContent.trim())) next.classList.add('fbig-ig-comment-btn');
                    let pNext = btn.parentElement ? btn.parentElement.nextElementSibling : null;
                    if (pNext && pNext.textContent && /^[0-9,.]+[km]?$/i.test(pNext.textContent.trim())) pNext.classList.add('fbig-ig-comment-btn');
                }
            });
            document.querySelectorAll('span, div, a').forEach(el => {
                if (el.children.length === 0 && el.textContent) {
                    const text = el.textContent.trim().toLowerCase();
                    if (/^[0-9,.]+[km]?$/i.test(text)) {
                        let prev = el.previousElementSibling;
                        let wrapper = el.parentElement;
                        for(let i=0; i<3 && !prev && wrapper; i++) {
                            prev = wrapper.previousElementSibling;
                            wrapper = wrapper.parentElement;
                        }
                        if (prev) {
                            if (prev.querySelector('svg[aria-label*="Like" i]') || prev.querySelector('svg[aria-label*="Unlike" i]')) {
                                el.classList.add('fbig-ig-like-count');
                            } else if (prev.querySelector('svg[aria-label*="Comment" i]')) {
                                el.classList.add('fbig-ig-comment-btn');
                            } else if (prev.querySelector('svg[aria-label*="Repost" i]') || prev.querySelector('svg[aria-label*="Share" i]')) {
                                el.classList.add('fbig-ig-repost-btn');
                            }
                        }
                    }

                    if (/^[0-9,.]+[km]?\s*(likes?|views?|æ¬¡èµž|æ¬¡æ’­æ”¾|ì¢‹ì•„ìš”|ì¡°íšŒ|ã „ã „ã ­ï¼ |å† ç”Ÿå›žæ•°)$/.test(text) ||
                        text.startsWith('liked by') || text === 'likes' || text === 'views') {
                        el.classList.add('fbig-ig-like-count');
                    }
                    if (/^[0-9,.]+[km]?\s*comments?/.test(text) || text === 'comments' || text === 'commentaires') {
                        el.classList.add('fbig-ig-comment-section');
                        if (el.parentElement) el.parentElement.classList.add('fbig-ig-comment-section');
                    }
                    if (text.includes('view all') && (text.includes('comment') || text.includes('replies'))) {
                        let c = el.parentElement;
                        for(let i=0; i<4 && c; i++) {
                            c.classList.add('fbig-ig-comment-section');
                            c = c.parentElement;
                        }
                    } else if (text === 'reply' || text === 'répondre') {
                        let li = el.closest('li') || el.closest('div[role="listitem"]');
                        if (li) {
                            li.classList.add('fbig-ig-comment-section');
                        } else {
                            let c = el.parentElement;
                            for (let i = 0; i < 6 && c && c !== document.body; i++) {
                                if (c.previousElementSibling && c.previousElementSibling.querySelector('img')) {
                                    c.classList.add('fbig-ig-comment-section');
                                    c.previousElementSibling.classList.add('fbig-ig-comment-section');
                                    if (c.parentElement) c.parentElement.classList.add('fbig-ig-comment-section');
                                    break;
                                }
                                c = c.parentElement;
                            }
                        }
                    }
                }
            });
            document.querySelectorAll('article ul').forEach(ul => {
                ul.classList.add('fbig-ig-comment-section');
            });
            document.querySelectorAll('form').forEach(form => {
                form.classList.add('fbig-ig-comment-section');
                let prev = form.previousElementSibling;
                if (prev && prev.querySelector('img')) {
                    prev.classList.add('fbig-ig-comment-section');
                    if (form.parentElement) form.parentElement.classList.add('fbig-ig-comment-section');
                } else if (form.parentElement) {
                    let pPrev = form.parentElement.previousElementSibling;
                    if (pPrev && pPrev.querySelector('img')) {
                        pPrev.classList.add('fbig-ig-comment-section');
                        form.parentElement.classList.add('fbig-ig-comment-section');
                        if (form.parentElement.parentElement) form.parentElement.parentElement.classList.add('fbig-ig-comment-section');
                    }
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
            document.querySelectorAll('svg[aria-label="Comment" i]').forEach(svg => {
                let btn = svg.closest('button, [role="button"]');
                if (btn) btn.classList.add('fbig-ig-comment-btn');
            });
        }
        if (isFB) {
            document.querySelectorAll('div[role="button"], span[role="button"], button').forEach(btn => {
                const label = btn.getAttribute('aria-label');
                const text = btn.textContent ? btn.textContent.trim().toLowerCase() : '';
                const likeWords = ['like', 'j\'aime', 'me gusta', 'gefÃ¤llt mir', 'piace', 'Ð½Ñ€Ð°Ð²Ð¸Ñ‚Ñ Ñ ', 'ì¢‹ì•„ìš”', 'ã „ã „ã ­ï¼ ', 'unlike'];
                const isExactLikeText = likeWords.includes(text);
                const isLikeLabel = label && (likeWords.includes(label.toLowerCase()) || label.toLowerCase() === 'remove like' || label.toLowerCase() === 'leave a reaction');
                if (isExactLikeText || isLikeLabel) {
                    btn.classList.add('fbig-fb-like-btn');
                }
                if (text === 'comment' || text === 'commenter' || text === 'comentar' || text === 'è¯„è®º' || text === 'ê°“ê¸€' || text === 'kommentieren') {
                    btn.classList.add('fbig-fb-comment-btn');
                }
            });
            document.querySelectorAll('.fbig-fb-like-btn').forEach(likeBtn => {
                let actionsRow = likeBtn.parentElement;
                while (actionsRow && actionsRow !== document.body) {
                    const buttons = actionsRow.querySelectorAll('div[role="button"], span[role="button"], button');
                    if (buttons.length >= 2 && actionsRow.tagName === 'DIV') {
                        let hasLikeBtn = Array.from(buttons).some(b => b.classList.contains('fbig-fb-like-btn'));
                        let hasCommentBtn = Array.from(buttons).some(b => b.classList.contains('fbig-fb-comment-btn'));
                        
                        if (hasLikeBtn && hasCommentBtn) {
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
                                        if (icon.parentElement) icon.parentElement.classList.add('fbig-fb-like-count');
                                    }
                                });
                            }
                            
                            let current = actionsRow;
                            for(let i=0; i<5 && current && current.getAttribute('role') !== 'article'; i++) {
                                if (current.nextElementSibling) {
                                    let sibling = current.nextElementSibling;
                                    let foundSibling = false;
                                    while(sibling) {
                                        sibling.classList.add('fbig-fb-comment-section');
                                        sibling = sibling.nextElementSibling;
                                        foundSibling = true;
                                    }
                                    if (foundSibling) break;
                                }
                                current = current.parentElement;
                            }

                            if (metadataRow) {
                                Array.from(metadataRow.children).forEach(child => {
                                    let t = child.textContent.toLowerCase();
                                    if (t.includes('comment') || t.includes('share') || t.includes('è¯„è®º') || t.includes('ê°“ê¸€')) {
                                        child.classList.add('fbig-fb-comment-section');
                                    }
                                });
                            }
                            break;
                        }
                    }
                    actionsRow = actionsRow.parentElement;
                }
            });
            document.querySelectorAll('div[aria-label*="Comment" i], div[aria-label*="comment by" i], div[aria-label*="Reply by" i], div[aria-label*="reply by" i]').forEach(comment => {
                comment.classList.add('fbig-fb-comment-section');
            });
            document.querySelectorAll('ul').forEach(ul => {
                if (ul.querySelector('div[role="article"]')) {
                    ul.classList.add('fbig-fb-comment-section');
                }
            });
            document.querySelectorAll('form').forEach(form => {
                if (form.textContent.toLowerCase().includes('comment')) {
                    form.classList.add('fbig-fb-comment-section');
                }
            });
            document.querySelectorAll('div[role="button"], span, a').forEach(el => {
                if (el.children.length === 0 && el.textContent) {
                    const text = el.textContent.trim().toLowerCase();
                    if (text === 'reply' || text === 'répondre' || text === 'ë‹µê¸€') {
                        let commentContainer = el.closest('ul') || el.closest('div[role="article"]');
                        if (commentContainer) {
                            commentContainer.classList.add('fbig-fb-comment-section');
                        } else {
                            let c = el.parentElement;
                            for(let i=0; i<4 && c; i++) {
                                if (c.querySelector('img')) {
                                    c.classList.add('fbig-fb-comment-section');
                                    break;
                                }
                                c = c.parentElement;
                            }
                        }
                    }
                }
            });
            document.querySelectorAll('a[href*="reaction/profile" i], a[href*="ufi/reaction/profile" i]').forEach(el => {
                el.classList.add('fbig-fb-like-count');
            });
            document.querySelectorAll('img[src*="reaction"]').forEach(img => {
                if (img.parentElement) {
                    img.parentElement.classList.add('fbig-fb-like-count');
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
        const uiHTML = `
            <button id="fbig-toggle-btn" title="Toggle Settings">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="6" ry="6"></rect>
                    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="10" font-weight="bold" font-family="sans-serif" fill="currentColor" stroke="none">G+</text>
                </svg>
            </button>
            <div id="fbig-panel">
                <div id="fbig-panel-header">
                    <h3>G+ Social Media Button Hider</h3>
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
                        <span>Hide Comments</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-ig-comments">
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
                    <div class="fbig-option">
                        <span>Hide Comments</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-fb-comments">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                    <div class="fbig-divider"></div>
                    <div class="fbig-section-title" style="color: #00f2fe !important;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.52.41-5.18 2.21-7.01 1.68-1.74 4.19-2.58 6.55-2.22V12.3c-1.28-.24-2.61-.09-3.79.48-1.35.63-2.4 1.83-2.81 3.25-.45 1.66-.02 3.49 1.1 4.82 1.17 1.42 3.11 2.05 4.9 1.64 1.77-.42 3.09-1.92 3.32-3.73.08-1.32.06-2.64.07-3.96l.01-14.78z"/></svg>
                        TikTok
                    </div>
                    <div class="fbig-option">
                        <span>Hide Like Buttons</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-tiktok-btn">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                    <div class="fbig-option">
                        <span>Hide Comments</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-tiktok-comments">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                    
                    <div class="fbig-divider"></div>
                    <div class="fbig-section-title" style="color: #1da1f2 !important;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        X (Twitter)
                    </div>
                    <div class="fbig-option">
                        <span>Hide Like Buttons</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-x-btn">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                    <div class="fbig-option">
                        <span>Hide Comments</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-x-comments">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                    <div class="fbig-option">
                        <span>Hide Reposts</span>
                        <label class="fbig-toggle-switch">
                            <input type="checkbox" id="fbig-opt-x-repost">
                            <span class="fbig-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;
        try {
            container.innerHTML = ttPolicy.createHTML(uiHTML);
        } catch (e) {
            console.error("FBIG Like Hider: TrustedTypes blocked innerHTML", e);
            return;
        }
        document.body.appendChild(container);
        const panel = document.getElementById('fbig-panel');
        const toggleBtn = document.getElementById('fbig-toggle-btn');
        const closeBtn = document.getElementById('fbig-panel-close');
        const header = document.getElementById('fbig-panel-header');
        if (!panel || !toggleBtn || !closeBtn || !header) return;
        const checkboxes = {
            hideIGAll: document.getElementById('fbig-opt-ig-all'),
            hideIGComments: document.getElementById('fbig-opt-ig-comments'),
            hideIGRepost: document.getElementById('fbig-opt-ig-repost'),
            hideIGSave: document.getElementById('fbig-opt-ig-save'),
            hideFBButton: document.getElementById('fbig-opt-fb-btn'),
            hideFBCount: document.getElementById('fbig-opt-fb-count'),
            hideFBComments: document.getElementById('fbig-opt-fb-comments'),
            hideTikTokBtn: document.getElementById('fbig-opt-tiktok-btn'),
            hideTikTokComments: document.getElementById('fbig-opt-tiktok-comments'),
            hideXBtn: document.getElementById('fbig-opt-x-btn'),
            hideXComments: document.getElementById('fbig-opt-x-comments'),
            hideXRepost: document.getElementById('fbig-opt-x-repost')
        };
        for (const [key, element] of Object.entries(checkboxes)) {
            if (!element) continue;
            element.checked = safeGM_getValue(key, false);
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
    function ensureUIPresent() {
        if (document.body && !document.getElementById('fbig-control-panel-container')) {
            initUI();
        }
    }
    checkBody();
    setInterval(ensureUIPresent, 2000);
})();
