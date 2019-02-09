

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
var queryURLZomato = `https://developers.zomato.com/api/v2.1/search?entity_id=305&entity_type=city&q=brewery`;

$.ajax({
    url: queryURLZomato,
    method: 'GET',
    beforeSend: function(request) {
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("user-key", "262af377ee8926dc56eff941cea5b5e1");
    },
}).then(function(data){
    console.log(data);
});

// Runs above function when clicked
$("#get-events").on("click", renderEvents);