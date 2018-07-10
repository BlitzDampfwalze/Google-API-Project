const LOCATION_SEARCH_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const NEARBY_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const PLACE_DETAILS = 'https://maps.googleapis.com/maps/api/place/details/output';
const WEATHER_URL = 'api.openweathermap.org/data/2.5/weather';
searchTerm = null;
key = 'AIzaSyBk_OjFoaTqmKgDpGuz1svo-a7OrwKsgV4';
appId = '6e3066cd484952d8fefaacbfe916af4a';

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
    success: renderDetails
  };
  $.ajax(settings);
}

function renderDetails(callBackData) {
  $('.js-search-results').append(`<div>     
        <div class="results">${callBackData.result.rating}</div>
    </div>`);
};

function renderWeather(result) {
  $('.js-search-results').append(`
        <div class="results">${weather.description}
        1.8*(${main.temp}-273)+32
        ${main.humidity}</div>`);
};

function renderResult(result) {

  return `
    <div>
      <h2>       
        <div class="results">${result.name}</div>
        <div class="results">${result.place_id}</div>
    </div>
  `;
};

function displaySearchData(callbackData) {
  //create an array//
  //const placeDetails = callbackData.results.place_id.map((id, index) => getDetails(id));
  const placeResults = callbackData.results.map((item, index) => renderResult(item));
  $('.js-search-results').html(placeResults);
  console.log(placeResults);
}

function nearbySearch(callbackData) {
  //console.log(callbackData)
  const geolocation = callbackData.results[0].geometry.location
  const {lat, lng} = geolocation
  console.log(`${lat},${lng}`);
  let keyword = searchTerm;
  //$('.js-search-form').submit(event => {
    //event.preventDefault();
   // const querySearchTerm = $(event.currentTarget).find('.js-search-term');
   // const searchTerm = querySearchTerm.val();
    //clear out input
   // querySearchTerm.val("");
    nearbyFromApi(keyword, lat, lng, displaySearchData);
    getWeather(lat, lng, renderWeather);
    


  //$('.js-search-results').html(results);
  //});
};

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryLocationTarget = $(event.currentTarget).find('.js-location-search');
    const location = queryLocationTarget.val();
    const querySearchTerm = $(event.currentTarget).find('.js-search-term');
    searchTerm = querySearchTerm.val();
    // clear out the input
    queryLocationTarget.val("");
    querySearchTerm.val("");
    getLocationFromApi(location, nearbySearch);
    //nearbyFromApi(searchTerm, displaySearchData);
    console.log(location);
    console.log(searchTerm);
  });
};
$(watchSubmit);

