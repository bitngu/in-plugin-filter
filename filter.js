// content script only has limited access to Chrome api, mostly chrome.runtime event.
// Can work with DOM elements

chrome.runtime.onMessage.addListener(
  // Use the chrome.runtime API to retrieve the service worker
  function(request, sender, sendResponse) {
    
    if (request.message === 'url update') {
      console.log("url update");
      console.log("previous: ", request.previousStart);
      console.log("current: ", request.currentStart);
      filterPage(); 
    }
});

// 


let userFilterOptions = {
  "timePosted": {
    "days": 0,
    "hours": 24
  },
  "Companies": ["Safeway", "Dice"],
  "Exp": "3",
  "Promoted": true
}

// 1. After page finish loading... find the scrollable listings
// 2. Use each of the listing to scroll to the bottom of the page.
//    a. Scroll by the height of each listing. Trigger event for scrolling so next list can `appear`

const PAGE_LOAD_TIMEOUT = 5000
const SCROLL_DELAY = 200


window.onload = () => {
  filterPage();
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


// when you view job. ie, you click on the posting, the promoted <li> changes

filterOptions = (post) => {
  let isFilterOut = false;
  const promoted = post.querySelector("li.job-card-container__footer-item");  
  // need to compare with user input
  if (promoted){
    console.log(promoted);
    if (promoted.textContent.trim() === "Promoted") {
      isFilterOut = true;
    }
  }

  let companyName = post.querySelector(".job-card-container__primary-description")
  if (companyName){
    companyName = companyName.textContent.trim()
    console.log(companyName);
    userFilterOptions.Companies.forEach((excludeName)=> {
      // maybe use regular expression
      if (companyName === excludeName){
        isFilterOut = true;
        console.log("Filtering out company: ", companyName);
      }
    })
  }
    
  // const jobDetailsLink = post.getElementsByTagName('a')[0]
  // if (jobDetailsLink){ 
  //   jobDetailsLink.click();
  //   const jobDetails = document.querySelector(".jobs-search__job-details--wrapper");
  //   let timePosted = jobDetails.querySelector("span.tvm__text.tvm__text--positive");
  //   console.log("timePosted: ", timePosted);
  //   if (timePosted){
  //     timePosted = timePosted.textContent.trim();
  //     if (!isLessThanPostedTime(timePosted, userFilterOptions.timePosted)){
  //       isFilterOut = true;
  //     }      
  //   }
  // }

  if (isFilterOut) {
    console.log("Filter Out: ", isFilterOut)
    post.style.display = 'none';
  }
}

// convert the days 
// 



// by default, we set the search for it to be by 1 hour

// so if a posting has 59 minutes are less are shown


// if user has set the hour to be `23 hour` anything less than 23 hour will show

// if user set by 1 day. everything that has 1day or less than 24 hours should be shown

// 

// say user input day 3; hours set to 0
// so any post that is 3 day before that should shown


isLessThanPostedTime = (t, options) => {

  let shouldDisplay = false;
  const timePosted = Number(t.match(/\d/g).join(""));

  if (t.includes("minute")){
    shouldDisplay = true;
  }else if (t.includes("hour") && timePosted <= options.hours){
    shouldDisplay = true;
  }else if (t.includes("day") && timePosted <= options.days){
    shouldDisplay = true;
  }
  return shouldDisplay;
}

// parse linked in time posted
// 59 minutes ago
// 24 minutes
// 3 hours ago

// by default, users can view by the hour

// so if user provide 23 hours
// 

// maybe create a time class and 

// so we know that minutes < hour

// 