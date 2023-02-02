let autocomplete;
function initAutocomplete() {
    const elems = document.querySelectorAll("#autocomplete");
    const elemsArr = [];
    for (let el of elems) {
        elemsArr.push(new google.maps.places.Autocomplete(
            el,
            {
                types: ['locality'],
                fields: ['name']
            }));
    }
}