chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      if (changeInfo.url) {
       const urlParams = new URLSearchParams(new URL(changeInfo.url).search);
       const currentStart = urlParams.get('start') || '0';
       chrome.storage.sync.get(['previousStart'], function (result) {
           const previousStart = result.previousStart || '0'; 
           if (previousStart !== currentStart) {
                // change url when go to next page 
               chrome.tabs.sendMessage(tabId, {
                   message: 'url update',
                   url: changeInfo.url,
                   previousStart: previousStart,
                   currentStart: currentStart
               });
               chrome.storage.sync.set({ previousStart: currentStart });
           }
       });
    }
  }
  );

