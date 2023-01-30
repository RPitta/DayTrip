let autocomplete1, autocomplete2, autocomplete3;
function initAutocomplete() {
    console.log("in initautocomplete()");
    autocomplete1 = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete-1'),
        {
            types: ['establishment'],
            fields: ['name']
        });

    autocomplete2 = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete-2'),
        {
            types: ['establishment'],
            fields: ['name']
        });

    autocomplete3 = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete-3'),
        {
            types: ['establishment'],
            fields: ['name']
        });
}