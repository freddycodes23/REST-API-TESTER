// Background service worker for REST API Tester extension
// Handles window management for the extension

let popupWindowId = null;

// Listen for extension icon click to manage popup window
chrome.action.onClicked.addListener(async () => {
  // Check if popup window already exists
  if (popupWindowId !== null) {
    try {
      const window = await chrome.windows.get(popupWindowId);
      // If window exists, focus it
      await chrome.windows.update(popupWindowId, { focused: true });
      return;
    } catch (e) {
      // Window no longer exists, reset the ID
      popupWindowId = null;
    }
  }

  // Create a new popup window
  const window = await chrome.windows.create({
    url: chrome.runtime.getURL('popup.html'),
    type: 'popup',
    width: 800,
    height: 700,
    focused: true
  });

  popupWindowId = window.id;
});

// Track when the popup window is closed
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    popupWindowId = null;
  }
});
