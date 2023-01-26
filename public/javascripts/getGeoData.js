$('#zip').blur(function () {
    var zip = $(this).val();
    var api_key = 'AIzaSyCvJIT4lKt9wTsoTzQd-Ow8XEdDj1sZwo0';
    if (zip.length) {
        // Make a request to the google geocode api with the zipcode as the address parameter and your api key
        $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&key=' + api_key).then(function (response) {
            // Parse the response for a list of matching city/state
            var possibleLocalities = geocodeResponseToCityState(response);
            fillCityAndStateFields(possibleLocalities);
        });
    }
});

function fillCityAndStateFields(localities) {
    var locality = localities[0]; // Use the first city/state object

    $('#city').val(locality.city);
    $('#state').val(locality.state);

    var $input;

    if (localities.length > 1) { // Possibly create a dropdown if we have multiple cities in the result.
        var $select = $(document.createElement('select'));
        for (var i = 0; i < localities.length; i++) {
            var city = localities[i].city;
            var $option = $(document.createElement('option'));
            $option.html(city);
            $option.attr('value', city);

            if (i == 0) {
                $option.attr('selected', 'selected');

            }

            $select.append($option);
            $select.attr('id', 'city');
            $select.attr('name', "city");

            $select.attr('class', 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500');

        }
        $input = $select;

    } else {
        var city = localities[0].city;
        var $text = $(document.createElement('input'));
        $text.attr('value', city);
        $text.attr('name', city);
        $text.attr('type', 'text');
        $input = $text;
    }

    $('#city-input-wrapper').html($input);

}

function geocodeResponseToCityState(geocodeJSON) { // Will return and array of matching {city,state} objects
    var parsedLocalities = [];
    if (geocodeJSON.results.length) {
        for (var i = 0; i < geocodeJSON.results.length; i++) {
            var result = geocodeJSON.results[i];

            var locality = {};
            for (var j = 0; j < result.address_components.length; j++) {
                var types = result.address_components[j].types;
                for (var k = 0; k < types.length; k++) {
                    if (types[k] == 'locality') {
                        locality.city = result.address_components[j].long_name;
                    } else if (types[k] == 'administrative_area_level_1') {
                        locality.state = result.address_components[j].short_name;
                    }
                }
            }
            parsedLocalities.push(locality);

            // Check for additional cities within this zip code
            if (result.postcode_localities) {
                for (var l = 0; l < result.postcode_localities.length; l++) {
                    parsedLocalities.push({ city: result.postcode_localities[l], state: locality.state });
                }
            }

            // Filter duplicate cities from dropdown
            parsedLocalities = parsedLocalities.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.city === value.city
                ))
            )

        }
    } else {
        console.log('error: no address components found');
    }

    return parsedLocalities;
}