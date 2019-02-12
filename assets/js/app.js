// Code for using SeatGeek API
var city = '';
var eventKeyword = '';
var eventDateStart = '';
var eventDateEnd = '';
var queryURLEvents = '';

// This function saves user input, then makes ajax call, then saves response in localStorage
function saveEvents() {    
    city = $("#city-events").val().trim();
    // keyword and date parameters are currently not returning any info from SeatGeek
    //  might have to remove or make input options either/or
    eventDateStart = $("#event-start").val().trim();
    eventDateEnd = $("#event-end").val().trim();
    var apiKey = 'MTUyMzkxNzF8MTU0OTc0OTQ1NC4wNA';
    queryURLEvents = `https://api.seatgeek.com/2/events?client_id=${apiKey}&venue.city=${city}&datetime_local.gte=${eventDateStart}&datetime_local.lte=${eventDateEnd}&per_page=25`;

    // Call to SeatGeek API
    $.ajax({
        url: queryURLEvents,
        method: 'GET',
        success: function(response){
            localStorage.setItem("data", JSON.stringify(response));
            window.location.replace("simpleResults.html");
        }
    });
}

// This retrieves from localStorage / displays AJAX response in simpleResults.html
function showEvents() {
    var eventData = localStorage.getItem("data");
    eventData = JSON.parse(eventData);
    console.log(eventData);
    for (var i=0; i < eventData.events.length; i++) {
        var newEvent = $("<tr>");
        var num = $("<th>");
        num.attr("scope", "row");
        num.text(i + 4);
        var title = $("<td>");
        title.text(eventData.events[i].title);
        var location = $("<td>");
        location.text(eventData.events[i].venue.name);
        var date = $("<td>");
        var dateTime = eventData.events[i].datetime_local;
        dateTime = moment(dateTime).format("MMM Do h:mm A");
        date.text(dateTime);
        var linkDiv = $("<td>");
        var link = $("<a>");
        link.attr("href", eventData.events[i].url);
        link.attr("target", "_blank");
        link.text("More info");
        linkDiv.append(link);
        newEvent.append(num, title, location, date, linkDiv);
        $("tbody").append(newEvent);
    }
}

// AJAX call for Zomato
let cityCode;
$('#brewerySubmit').on('click', cityNameAJAX);
function cityNameAJAX(event) {
    event.preventDefault();

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
        cityCodeAJAX();
    });
}
function cityCodeAJAX() {
    let queryURLCode = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityCode}&entity_type=city&q=brewery`;
    $.ajax({
        url: queryURLCode,
        method: 'GET',
        beforeSend: function(request) {
            request.setRequestHeader("Accept", "application/json");
            request.setRequestHeader("user-key", "262af377ee8926dc56eff941cea5b5e1");
        },
    }).then(function(data){
        let restaurantName = data.restaurants[0].restaurant.name;
        console.log(restaurantName);
    });
}

// Runs above function when clicked
$("#get-events").on("click", saveEvents);