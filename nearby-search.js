const LOCATION_SEARCH_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const NEARBY_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const PLACE_DETAILS = 'https://maps.googleapis.com/maps/api/place/details/json';
const WEATHER_URL = 'api.openweathermap.org/data/2.5/weather';
searchTerm = null;


function getWeather(lat, lng, callback) {
  const settings = {
    url: WEATHER_URL,
    data: {
      lat: lat,
      lon: lng,
      APPID: appId
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
      key: key,
      address: `${searchLocation}`,      
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);  
}

function nearbyFromApi(keyword, lat, lng, callback) {
  const settings = {
    url: NEARBY_SEARCH_URL,
    data: {
      key: key,
      keyword: `${keyword}`, 
      location: `${lat},${lng}`,
      //radius: '10000',
      rankby: 'distance',          
    },
    dataType: 'json',
    type: 'GET',
    success: callback
      // data => {
      // callback;
      // const arrayIds = []
      // arrayIds.push(data.results.place_id)
  };
  $.ajax(settings);  
}

function getDetails(id) {
  const settings = {
    url: PLACE_DETAILS,
    data: {
      key: key,
      placeid: `${id}`,
    },
    dataType: 'json',
    type: 'GET',
    success: function(callBackData) { 
      console.log(id);
      console.log(callBackData.result.rating);
                  $(`#${id}`).append(`<div>${callBackData.result.rating}</div>`)
                }}
                
  $.ajax(settings);
}



function renderResult(result) {
  let id = result.place_id;
  return(`     
        <div class="results" id="${id}">${result.name}</div>
  `);
};

function displaySearchData(callbackData) {
  const placeResults = callbackData.results.map((item, index) => renderResult(item));
  $('.js-search-results').html(placeResults);
  displayDetails(callbackData);
}

function displayDetails(callbackData) {
  callbackData.results.map((item, index) => getDetails(item.place_id));
}

function nearbySearch(callbackData) {
  const geolocation = callbackData.results[0].geometry.location
  const {lat, lng} = geolocation
  console.log(`${lat},${lng}`);
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
    queryLocationTarget.val("");
    querySearchTerm.val("");

    getLocationFromApi(location, nearbySearch); // Makes an API call with locations input and calls function to retrieve geo-coordinates
    console.log(location);
    console.log(searchTerm);
  });
};
$(watchSubmit);

function renderWeather(result) {
  $('.js-search-results').append(`
        <div class="results">${weather.description}
        1.8*(${main.temp}-273)+32
        ${main.humidity}</div>`);
};