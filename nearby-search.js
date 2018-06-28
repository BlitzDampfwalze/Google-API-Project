const LOCATION_SEARCH_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const NEARBY_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

function getLocationFromApi(searchLocation, callback) {
  const settings = {
    url: LOCATION_SEARCH_URL,
    data: {
      key: '#',
      address: `${searchLocation}`,      
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);  
}

function nearbyFromApi(searchTerm, lat, lng, callback) {
  const settings = {
    url: NEARBY_SEARCH_URL,
    data: {
      key: '#',
      keyword: `${searchTerm}`, 
      location: `${lat},${lng}`,
      // radius: '10000',
      rankby: 'prominence',          
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);  
}

function renderResult(result) {
  return `
    <div>
      <h2>       
        <div class="results">${result.name}</div>
    </div>
  `;
};

function displaySearchData(callbackData) {
  const placeResults = callbackData.results.map((item, index) => renderResult(item));
  $('.js-search-results').html(placeResults);
  console.log(placeResults);
}

function nearbySearch(callbackData) {
  const geolocation = callbackData.results[0].geometry.location
  const {lat, lng} = geolocation
  console.log(`${lat},${lng}`);

  $('.js-search-form').submit(event => {
    event.preventDefault();
    const querySearchTerm = $(event.currentTarget).find('.js-search-term');
    const searchTerm = querySearchTerm.val();
    //clear out input
    querySearchTerm.val("");
    nearbyFromApi(searchTerm, lat, lng, displaySearchData);
    console.log(searchTerm);


  //$('.js-search-results').html(results);
  });
};



function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryLocationTarget = $(event.currentTarget).find('.js-location-search');
    const location = queryLocationTarget.val();
    //const querySearchTerm = $(event.currentTarget).find('.js-search-term');
    //const searchTerm = querySearchTerm.val();
    // clear out the input
    queryLocationTarget.val("");
    getLocationFromApi(location, nearbySearch);
    //nearbyFromApi(searchTerm, displaySearchData);
    console.log(location);
    //console.log(searchTerm);
  });
};
$(watchSubmit);

