chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      if (changeInfo.url) {
      //   chrome.tabs.sendMessage( tabId, {
      //     message: 'url update',
      //     url: changeInfo.url
      //   })
      // }
       // Extract the current 'start' parameter from the URL
       const urlParams = new URLSearchParams(new URL(changeInfo.url).search);
       const currentStart = urlParams.get('start') || '0';
       // Get the previous start value from Chrome storage
       chrome.storage.local.get(['previousStart'], function (result) {
           const previousStart = result.previousStart || '0'; // Default to 0 if first time
           if (previousStart !== currentStart) {
               // Only act if the 'start' parameter has changed
               chrome.tabs.sendMessage(tabId, {
                   message: 'url update',
                   url: changeInfo.url,
                   previousStart: previousStart,
                   currentStart: currentStart
               });

               // Update the stored 'start' value
               chrome.storage.local.set({ previousStart: currentStart });
           }
       });
    }
  }
  );

