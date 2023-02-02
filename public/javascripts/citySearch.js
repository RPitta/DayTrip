function citySearch(event) {
    if (event.key == "Enter") {
        const elems = {};
        let forms = document.querySelectorAll("#searchForm");
        let inputs = document.querySelectorAll("#autocomplete");
        elems[forms[0]] = inputs[0];
        elems[forms[1]] = inputs[1];

        for (let i = 0; i < 2; i++) {
            let inputVal = inputs[i].value;
            if (inputVal !== "") {
                // Regex validation matching city name "<city>, <stateabbrev>, USA"
                if (/^([^,]+),\s([A-Z]{2})(?:\s(\d{5}))?,\s(USA)$/.test(inputVal)) {
                    forms[i].action = "cities/" + inputVal + "";         // Action path
                } else {
                    forms[i].action = "cities/error/" + inputVal + "";
                }

                window.location = forms[i].action;                    // Remove trailing question mark
                forms[i].submit();                                    // Submit the form
            }
        }
    }
}

