// Disaply city page and save city to database if not already in 
// arr = str.replace(/\s/g, "").split(",")
// city = {name: arr[0], state, arr[1], country: arr[2]}

function citySearch(event) {

    if (event.key == "Enter") {
        var myForm = document.getElementById("searchForm");     // Get form element
        var myInput = document.getElementById("autocomplete");   // Get input element
        var inputValue = myInput.value;                     // Get input value
        myForm.action = "cities/" + inputValue + "";         // Action path
        // myForm.action = inputValue + "";         // Action path

        window.location = myForm.action;                    // Remove trailing question mark
        myForm.submit();                                    // Submit the form
    }



}

