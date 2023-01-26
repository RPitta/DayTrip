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

// function yelpAuto() {
//     console.log("in yelpAuto()");
//     var api_key = 'AIzaSyCvJIT4lKt9wTsoTzQd-Ow8XEdDj1sZwo0';

//     var scripts = document.getElementsByTagName('script');
//     var lastScript = scripts[scripts.length - 2];
//     var scriptName = lastScript;

//     const city = scriptName.getAttribute('city');

//     // Get lat and long for yelp business autocomplete
//     axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
//         params: {
//             address: city,
//             key: api_key
//         }
//     })
//         .then(function (res) {
//             const lat = res.data.results[0].geometry.location.lat;
//             const long = res.data.results[0].geometry.location.lng
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// }
