// ==UserScript==
// @name         WPlace Pixels Notifier
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Notify when available pixels reach the maximum on wplace.live, but ignore right after load/refresh.
// @author       Waramoto
// @match        https://wplace.live/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    let lastNotifiedValue = null;
    let allowNotifications = false;

    // Prevent notifications when loading/refreshing the page
    setTimeout(() => {
        allowNotifications = true;
        console.log("[Pixels Notifier] Notifications are now active.");
    }, 30000);

    const oldFillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function(text, x, y, ...rest) {
        const match = String(text).match(/(\d+)\s*\/\s*(\d+)/);
        if (match) {
            const available = parseInt(match[1], 10);
            const max = parseInt(match[2], 10);

            if (allowNotifications && available === max && lastNotifiedValue !== available) {
                lastNotifiedValue = available;
                sendNotification(`Pixels full: ${available}/${max}`);
            }
        }

        return oldFillText.call(this, text, x, y, ...rest);
    };

    function sendNotification(message) {
        if (Notification.permission === "granted") {
            new Notification("WPlace Notification", {
                body: message,
                icon: "https://www.google.com/s2/favicons?sz=64&domain=wplace.live"
            });
        }
    }
})();
