const LOCATION_SEARCH_URL = '';

function getDataFromApi(searchLocation, callback) {
  const settings = {
    url: LOCATION_SEARCH_URL,
    data: {
      key: #,
      address: `${searchLocation}`,
      limit: 10
      
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
    console.log(settings)
  $.ajax(settings);
}

function renderResult(result) {
  return `
    <div>
      <h2>       
        <div class="results">${result...}</div>
    </div>
  `;
};

function displaySearchData(data) {
  //const results = data.events.map((item, index) => renderResult(item));
  //$('.js-search-results').html(results);
};



function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displaySearchData);
    console.log(query)
    console.log(queryTarget)
  });
};
$(watchSubmit);