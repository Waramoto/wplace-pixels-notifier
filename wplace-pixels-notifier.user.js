// ==UserScript==
// @name         WPlace Pixels Notifier
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Notify when available pixels reach the maximum on wplace.live, delayed startup check, no duplicate alerts after painting
// @author       Waramoto
// @match        https://wplace.live/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    let lastCanvasText = null; // store last observed X/Y
    let lastNotifiedValue = null;
    let allowNotifications = false; // start notifications only after delay
    let resetTimer = null;

    const STARTUP_DELAY_MS = 30000; // 30 seconds
    const RESET_DELAY_MS = 5000; // wait 5s before allowing new "full" alert after painting

    const oldFillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y, ...rest) {
        const match = String(text).match(/(\d+)\s*\/\s*(\d+)/);
        if (match) {
            const available = parseInt(match[1], 10);
            const max = parseInt(match[2], 10);
            lastCanvasText = { available, max };

            if (allowNotifications) {
                if (available === max && lastNotifiedValue !== available) {
                    lastNotifiedValue = available;
                    sendNotification(`Pixels full: ${available}/${max}`);
                } else if (available < max) {
                    // Schedule reset only if pixels were spent
                    if (resetTimer) clearTimeout(resetTimer);
                    resetTimer = setTimeout(() => {
                        lastNotifiedValue = null;
                    }, RESET_DELAY_MS);
                }
            }
        }

        return oldFillText.call(this, text, x, y, ...rest);
    };

    // Enable notifications after startup delay and do initial check
    setTimeout(() => {
        allowNotifications = true;
        console.log("[Pixels Notifier] Notifications are now active.");
        if (lastCanvasText && lastCanvasText.available === lastCanvasText.max) {
            lastNotifiedValue = lastCanvasText.available;
            sendNotification(`Pixels full: ${lastCanvasText.available}/${lastCanvasText.max}`);
        }
    }, STARTUP_DELAY_MS);

    function sendNotification(message) {
        if (Notification.permission === "granted") {
            new Notification("WPlace Notification", {
                body: message,
                icon: "https://www.google.com/s2/favicons?sz=64&domain=wplace.live"
            });
        }
    }
})();
