document.addEventListener('DOMContentLoaded', function() {
    
    // close popup
    const closeButton = document.getElementById("close-popup")
    closeButton.addEventListener('click', () => {
        window.close();
    })

    // add companies when user press enters
    document.addEventListener('keydown', (event) => {
        if (event.key === "Enter"){
            const filterCompany = document.getElementById("filtered-company-input");
            if(addFilterCompany(filterCompany.value)){
                filterCompany.value = '';
            };
            
        }
    })

    // set stored values
    const saveButton = document.getElementById("save-settings");
    saveButton.addEventListener('click', () => {
        const filteredList = Array.from(document.getElementById("filtered-company-list").children)
                                      .map(item => item.textContent);
        const filterPromotedJob = document.getElementById("filter-promoted-jobs").value;
        const filterViewedJob = document.getElementById("filter-viewed-jobs").value;
        chrome.storage.sync.set({
            "filterPromotedJob": filterPromotedJob,
             "filterViewedJob": filterViewedJob, 
             "filteredCompanyList": filteredList
            })
    })

    // load in the saved settings
    chrome.storage.sync.get(["filterPromotedJob", "filterViewedJob", "filteredCompanyList"], (result) => {
        const filterPromotedJob = document.getElementById("filter-promoted-jobs");
        const filterViewedJob = document.getElementById("filter-viewed-jobs");
        filterPromotedJob.value = result.filterPromotedJob; 
        filterViewedJob.value = result.filterViewedJob;
        result.filteredCompanyList.forEach(companyName => {
            addFilterCompany(companyName);
        });
    })
});


addFilterCompany = (companyName) => {
    let isCompanySet = false;
    let isAddSuccess = false;
    let filteredList = document.getElementById("filtered-company-list");
    filteredCompanies = filteredList.children;
    for (let i = 0; i < filteredCompanies.length; ++i){
        if (companyName === filteredCompanies[i].textContent || companyName === ''){
            isCompanySet = true;
            break;
        }
    }
    if (!isCompanySet){
        isAddSuccess = true;
        let li = document.createElement('li');
        li.style.cursor = 'default';
        li.appendChild(document.createTextNode(companyName));
        li.addEventListener('click', () => {
            filteredList.removeChild(li); 
        });
        filteredList.appendChild(li);
    }
    return isAddSuccess; 
}