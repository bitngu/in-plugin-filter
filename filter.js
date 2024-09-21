const PAGE_LOAD_TIMEOUT = 3000;
const SCROLL_DELAY = 200;

let userOption = {
  filterPromotedJob: '',
  filterViewedJob: '',
  filteredCompanyList: []
};

chrome.runtime.onMessage.addListener(
  // Use the chrome.runtime API to retrieve the service worker
  function(request, sender, sendResponse) {
    if (request.message === 'page loaded'){
      userOption.filterPromotedJob = request.filterPromotedJob;
      userOption.filterViewedJob = request.filterViewedJob;
      userOption.filteredCompanyList = request.filteredCompanyList;
    }    

    if (request.message === 'url update') { 
      filterPage(userOption); 
    }
});

window.onload = () => {
  filterPage(userOption);
}
 
filterPage = () => {
  setTimeout(() => {
    let scrollableContainer = document.querySelector(".jobs-search-results-list");
    let postings = document.querySelector(".scaffold-layout__list-container").children;
  
    let jobIndex = 0;
    //Simulate the scroll incrementally with a small delay
    let scrollInterval = setInterval(() => {
      if (jobIndex >= postings.length) {
        // Stop once we've scrolled through all postings
        clearInterval(scrollInterval); 
      } else {
        scrollableContainer.scrollTop += postings[jobIndex].offsetHeight;
        filterOptions(postings[jobIndex]);  
      }
      ++jobIndex;
    }, SCROLL_DELAY);
  }, PAGE_LOAD_TIMEOUT)
}


filterOptions = (post) => {
  let isFilterOut = false;
  const jobCardList = post.querySelectorAll("li.job-card-container__footer-item");
  jobCardList.forEach(ele => {
    const filterText = ele.textContent.trim();
    if ((filterText === "Promoted" && userOption.filterPromotedJob === 'true') ||
     (filterText === "Viewed" && userOption.filterViewedJob === 'true')){
      isFilterOut = true;
    }
  })

  let companyName = post.querySelector(".job-card-container__primary-description");
  if (companyName){
    companyName = companyName.textContent.trim();
    userOption.filteredCompanyList.forEach((excludeName)=> {
      // maybe use regular expression
      if (companyName === excludeName){
        isFilterOut = true;
      }
    })
  }

  if (isFilterOut) {
    post.style.display = 'none';
  }
}
