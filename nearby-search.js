const LOCATION_SEARCH_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const NEARBY_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const PLACE_DETAILS = 'https://maps.googleapis.com/maps/api/place/details/json';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
searchTerm = null;

function getWeather(lat, lng, callback) {
  const settings = {
    url: WEATHER_URL,
    data: {
      lat: lat,
      lon: lng,
      APPID: config.APP_ID
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

function getLocationFromApi(searchLocation, callback) {
  const settings = {
    url: LOCATION_SEARCH_URL,
    data: {
      key: config.KEY,
      address: `${searchLocation}`,      
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
    // fail: handleFail
  };
  $.ajax(settings);  
}

function nearbyFromApi(keyword, lat, lng, callback) {
  const settings = {
    url: NEARBY_SEARCH_URL,
    data: {
      key: config.KEY,
      keyword: `${keyword}`, 
      location: `${lat},${lng}`,
      rankby: 'distance',          
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);  
}

function getDetails(id) {
  const settings = {
    url: PLACE_DETAILS,
    data: {
      key: config.KEY,
      placeid: `${id}`,
    },
    dataType: 'json',
    type: 'GET',
    success: function(callBackData) { 
                  let rating = callBackData.result.rating;
                  let phone = callBackData.result.formatted_phone_number;

                  if(rating===undefined) { let rating = 'not yet rated';
                    $(`#${id}`).append(`<div>Rating: ${rating}</div>`)
                  }
                  else {$(`#${id}`).append(`<div>Rating: ${callBackData.result.rating}/5</div>`) }

                  $(`#${id}`).append(`<div>${callBackData.result.formatted_address}</div>`)
                  
                  if(phone===undefined) { let phone = 'Phone: unavailable';
                    $(`#${id}`).append(`<div>${phone}</div>`)}
                  else {$(`#${id}`).append(`<div>${callBackData.result.formatted_phone_number}</div>`)}
                  
                  $(`#${id}`).append(`<div><a href="${callBackData.result.website}">website</a></div>`)                  
                }}
                
  $.ajax(settings);
}

function renderResult(result) {
  let id = result.place_id;
  return(`
        <h3>     
          <div class="results" id="${id}"><span class="result-name">${result.name}</span></div>
  `);
};

function displaySearchData(callbackData) {
  const placeResults = callbackData.results.map((item, index) => renderResult(item));
  $('.js-search-results').prop('hidden', false).html(placeResults);
  displayDetails(callbackData);
}

function displayDetails(callbackData) {
  callbackData.results.map((item, index) => getDetails(item.place_id));
}

function nearbySearch(callbackData) {
  console.log(callbackData);
  const geolocation = callbackData.results[0].geometry.location
  const {lat, lng} = geolocation
  let keyword = searchTerm;

    nearbyFromApi(keyword, lat, lng, displaySearchData); // Makes an API call with the search term and the geolocation and calls a function to display the results
    getWeather(lat, lng, renderWeather);
};

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryLocationTarget = $(event.currentTarget).find('.js-location-search');
    const location = queryLocationTarget.val();

    const querySearchTerm = $(event.currentTarget).find('.js-search-term');
    searchTerm = querySearchTerm.val();
    
    // reset the inputs and remove 
    queryLocationTarget.val("");
    querySearchTerm.val("");

    getLocationFromApi(location, nearbySearch); // Makes an API call with locations input and calls function to retrieve geo-coordinates
  });
};
$(watchSubmit);

function renderWeather(result) {
  let tempF = Math.round(1.8*(result.main.temp-273)+32);
  $('#weather').html(`
        <div class="weather">
          <h2>Weather Forecast:</h2>
          Condition: ${result.weather[0].description}
          <div>Temperature: ${tempF}&deg;</div>
          <div>Humidity: ${result.main.humidity}%</div>
        </div>`);
};
