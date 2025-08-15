chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: 'onboarding.html' });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-link") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      });
    });
  }
});