// Initialize Firebase
var config = {
    apiKey: "AIzaSyCWGH8fpxEBU4lQMwhL8scicSp7kL1bGpM",
    authDomain: "trip-over-this.firebaseapp.com",
    databaseURL: "https://trip-over-this.firebaseio.com",
    projectId: "trip-over-this",
    storageBucket: "trip-over-this.appspot.com",
    messagingSenderId: "511118842960"
};
firebase.initializeApp(config);

// Runs above function when clicked
$("#get-events").on("click", saveEvents);

// Code for using SeatGeek API
var city = '';
var eventKeyword = '';
var eventDateStart = '';
var eventDateEnd = '';
var queryURLEvents = '';

// This function saves user input, then makes ajax call, then saves response in localStorage
function saveEvents() {    
    city = $("#city-events").val().trim();
    eventDateStart = $("#event-start").val();
    eventDateEnd = $("#event-end").val();
    var apiKey = 'MTUyMzkxNzF8MTU0OTc0OTQ1NC4wNA';

    if (city) {
        if (!eventDateStart || !eventDateEnd) {
            queryURLEvents = `https://api.seatgeek.com/2/events?client_id=${apiKey}&venue.city=${city}&per_page=25`;
        } else {
            queryURLEvents = `https://api.seatgeek.com/2/events?client_id=${apiKey}&venue.city=${city}&datetime_local.gte=${eventDateStart}&datetime_local.lte=${eventDateEnd}&per_page=25`;
        }
      
        // Clearing input fields for appearance
        $("#city-events").val('');
        $("#event-start").val('');
        $("#event-end").val('');
    
        // Call to SeatGeek API
        $.ajax({
            url: queryURLEvents,
            method: 'GET',
        }).then(function(data){
            console.log(data);
            for (var i=0; i < data.events.length; i++) {
                var newEvent = $("<div>");
                var title = $("<p>");
                title.text(data.events[i].title);
                var location = $("<p>");
                location.text(data.events[i].venue.name);
                var date = $("<p>");
                var dateTime = data.events[i].datetime_local;
                dateTime = moment(dateTime).format("MMM Do h:mm A");
                date.text(dateTime);
                var image = $("<img>"); {
                    if (data.events[i].performers[0].image === null) {
                        image.attr("src", "assets/angry.png");
                    } else {
                        image.attr("src", data.events[i].performers[0].image);
                    }
                } 
                var linkDiv = $("<p>");
                var link = $("<a>");
                link.attr("href", data.events[i].url);
                link.attr("target", "_blank");
                link.text("More info");
                linkDiv.append(link);
                newEvent.append(title, location, date, linkDiv, image);
                $("#event-results").append(newEvent);
            }
        });
    cityNameAJAX();
    hideAndShow();
    }
}

// AJAX call for Zomato

let cityCode, restaurantName;

function cityNameAJAX(event) {

    let cityName = $('#city-events').val();
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
        restaurantName = data.restaurants[0].restaurant.name;
        $('.restaurantData').text(restaurantName);
    });
}

function hideAndShow() {
    $('#searchForm').addClass('d-none');

    let newContainer = $('<div>');
    $(newContainer).addClass('container');
    $('#background-container').append(newContainer);
    
    let newRow = $('<div>');
    $(newRow).addClass('row');
    $(newContainer).append(newRow);

    let newEventCol = $('<div>');
    $(newEventCol).addClass('col-md-6 eventData')
    $(newRow).append(newEventCol);
    let newRestaurantCol = $('<div>');
    $(newRestaurantCol).addClass('col-md-6 restaurantData')
    $(newRow).append(newRestaurantCol);

};