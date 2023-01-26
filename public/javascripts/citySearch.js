function citySearch(event) {
    if (event.key == "Enter") {
        var myForm = document.getElementById("searchForm");      // Get form element
        var myInput = document.getElementById("autocomplete");   // Get input element
        var inputValue = myInput.value;                          // Get input value

        // Regex validation matching city name "<city>, <stateabbrev>, USA"
        if (/^([^,]+),\s([A-Z]{2})(?:\s(\d{5}))?,\s(USA)$/.test(inputValue)) {
            myForm.action = "cities/" + inputValue + "";         // Action path
        } else {
            myForm.action = "cities/error/" + inputValue + "";
        }

        window.location = myForm.action;                    // Remove trailing question mark
        myForm.submit();                                    // Submit the form
    }
}

