

// Code for using SeatGeek API
var city = '';
var keyword = '';
var queryURL = '';

function renderEvents(e) {
    e.preventDefault();
    city = $("#city-name").val().trim();
    keyword = $("#keyword").val().trim();
    var apiKey = 'MTUyMzkxNzF8MTU0OTc0OTQ1NC4wNA';
    queryURL = `https://api.seatgeek.com/2/events?client_id=${apiKey}&venue.city=${city}`;

    if(keyword) {
        queryURL = `https://api.seatgeek.com/2/events?client_id=${apiKey}&venue.city=${city}&q=${keyword}`;
    }

    // Call to SeatGeek API
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(data){
        console.log(data);
    });
}

// AJAX call for Zomato


let cityName = $('#city-name').val().trim();
let queryURLCity = `https://developers.zomato.com/api/v2.1/locations?query=${cityName}`;

$.ajax({
    url: queryURLCity,
    method: 'GET',
    beforeSend: function(request) {
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("user-key", "262af377ee8926dc56eff941cea5b5e1");
    },
}).then(function(data){
    cityCode = data.location_suggestions[0].city_id;
});


let cityCode = '';
var queryURLCode = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityCode}&entity_type=city&q=brewery`;

$.ajax({
    url: queryURLCode,
    method: 'GET',
    beforeSend: function(request) {
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("user-key", "262af377ee8926dc56eff941cea5b5e1");
    },
}).then(function(data){
    console.log(data);
    let restaurantName = data.restaurants[0].restaurant.name;
    console.log(restaurantName);
});

// Runs above function when clicked
$("#get-events").on("click", renderEvents);