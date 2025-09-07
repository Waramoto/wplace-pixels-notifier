# Wplace Pixels Notifier

Script for Tampermonkey that notifies when available pixels reach the maximum on wplace.live.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) extension for your browser.
2. Open the script file: [wplace-pixels-notifier.user.js](https://github.com/Waramoto/wplace-pixels-notifier/raw/main/wplace-pixels-notifier.user.js).
3. Tampermonkey will prompt you to install the script. Confirm the installation.
4. Visit [wplace.live](https://wplace.live/) or reload if it's already opened - the script will run automatically.

## Notes

- The script only works while the **wplace.live** page is open in your browser.  
  If the tab is closed or the browser is not running, notifications will not be delivered.  
- Notifications are requested once on the first run. Please make sure you grant permission for browser notifications.  
- There is a **startup delay** (default: 30 seconds) before notifications become active. This prevents instant alerts right after page load/refresh.  
- To avoid spam, the script will only send a notification once when pixels become full,  
  and will reset after you spend pixels (with a short delay).  
- You can adjust timing values (`STARTUP_DELAY_MS`, `RESET_DELAY_MS`) in the script if needed.  
