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

    if (changeInfo.status === 'complete') {
        chrome.storage.sync.get(["filterPromotedJob", "filterViewedJob", "filteredCompanyList"], function (result) {
            const filterPromotedJob = result.filterPromotedJob || '';
            const filterViewedJob = result.filterViewedJob || '';
            const filteredCompanyList = result.filteredCompanyList || [];
            chrome.tabs.sendMessage(tabId, {
                message: 'page loaded',
                url: changeInfo.url,
                filterPromotedJob: filterPromotedJob,
                filterViewedJob: filterViewedJob,
                filteredCompanyList: filteredCompanyList
            });
        });
    };
});

