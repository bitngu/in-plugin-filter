// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the select element
    const selectElement = document.querySelector('.filter-promoted-jobs');
    console.log(selectElement);
    // Get the save button element
    const saveButton = document.getElementById('save-settings');

    // Add event listener for the save button
    saveButton.addEventListener('click', function() {
        // Get the selected value from the dropdown
        const selectedValue = selectElement.value;

        // Store the value (using chrome.storage.sync for saving settings)
        chrome.storage.sync.set({ promotedJobsFilter: selectedValue }, function() {
            console.log('Settings saved:', selectedValue);
        });
    });

    // Load previously saved settings when the popup opens
    chrome.storage.sync.get('promotedJobsFilter', function(data) {
        if (data.promotedJobsFilter) {
            selectElement.value = data.promotedJobsFilter;
        }
    });
});
