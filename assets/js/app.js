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

// Variables for SeatGeek API
var city = '';
var eventKeyword = '';
var eventDateStart = '';
var eventDateEnd = '';
var queryURLEvents = '';
let cityCode = '';
var sadSound = $("<audio>");
sadSound.attr("src", "assets/womp-womp.mp3");

// Function runs 3 API calls, appends info to page ~ Runs when div with #get-info is clicked
function getInfo() {    
    // getting info from user input and saving to variables
    city = $("#city-events").val().trim();
    eventDateStart = $("#event-start").val();
    eventDateEnd = $("#event-end").val();

    var apiKey = 'MTUyMzkxNzF8MTU0OTc0OTQ1NC4wNA';

    // Conditionals handle if user does not enter a city or date range
    if (city && eventDateStart && eventDateEnd) {
        // Play sad sounds when button clicked
        sadSound.get(0).play();
        // checks if start and end date are the same
        if (eventDateStart === eventDateEnd) {
            // Update queryURL
            queryURLEvents = `https://api.seatgeek.com/2/events?client_id=${apiKey}&venue.city=${city}&per_page=10`;
        } else {
            // Update queryURL
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
            // Looping through data.events array
            for (var i=0; i < data.events.length; i++) {
                // Creating new DOM elements to hold API info
                var newEvent = $("<div>");
                // Event title
                var title = $("<p>");
                title.text(data.events[i].title);
                // Event location (venue)
                var location = $("<p>");
                location.text(data.events[i].venue.name);
                // Event Date & Time
                var date = $("<p>");
                var dateTime = data.events[i].datetime_local;
                dateTime = moment(dateTime).format("MMM Do h:mm A");
                date.text(dateTime);
                // Event image from seatgeek
                var image = $("<img>"); {
                    // if seatgeek image does not exist, replace image source with angry face placeholder
                    if (data.events[i].performers[0].image === null) {
                        image.attr("src", "assets/images/angry.png");
                    } else {
                        image.attr("src", data.events[i].performers[0].image);
                    }
                } 
                // Event link on seatgeek site ~ p tag added for div positioning
                var linkDiv = $("<p>");
                var link = $("<a>");
                link.attr("href", data.events[i].url);
                link.attr("target", "_blank");
                link.text("More info");
                linkDiv.append(link);
                // Append it all to empty div
                newEvent.append(title, location, date, linkDiv, image);
                // Append that to event column
                $("#eventData").append(newEvent);
            }
        });
        // Zomato API call #1 - for city code
        let cityName = city;
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
            // nesting second call within the first response
            cityCodeAJAX();
        });

        hideAndShow(); // Keeping separate so that this function can just handle ajax calls
    } else { // runs if user doesn't enter a city or date range
        $("#error-message").text("Please enter a city and date range.");
    }
}

// AJAX call for Zomato - get breweries
function cityCodeAJAX() {
    let queryURLCode = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityCode}&entity_type=city&q=brewery&count=10`;
    $.ajax({
        url: queryURLCode,
        method: 'GET',
        beforeSend: function(request) {
            request.setRequestHeader("Accept", "application/json");
            request.setRequestHeader("user-key", "262af377ee8926dc56eff941cea5b5e1");
        },
    }).then(function(data){
        let resultsArr = data.restaurants;
        for (let i = 0; i < resultsArr.length; i++) {
            let restaurantName = resultsArr[i].restaurant.name;
            // Create elements
            let newCard = $('<div>');
            let newImg = $('<img>');
            let newBody = $('<div>');
            let newTitle = $('<h5>');
            let newText = $('<p>');
            let newLike = $('<a>');
            // Add classes
            $(newCard).addClass('card');
            $(newImg).addClass('card-img-top');
            $(newBody).addClass('card-body');
            $(newTitle).addClass('card-title');
            $(newText).addClass('card-text');
            $(newLike).addClass('btn btn-primary');
            // Add text
            $(newImg).attr('src', 'http://placehold.it/350x150');
            $(newTitle).text(restaurantName);
            $(newText).text('Insert text here');
            $(newLike).attr('href', '#');
            $(newLike).text('Like');
            // Add to DOM
            $('#restaurantData').append(newCard);
            $(newCard).append(newImg);
            $(newCard).append(newBody);
            $(newBody).append(newTitle);
            $(newBody).append(newText);
            $(newBody).append(newLike);
        }
    });
}

function hideAndShow() {
    // Hide search form
    $('#searchForm').addClass('d-none');

    // Make a button to search again
    $('#newSearchBtn').removeClass('d-none');
};

$('#newSearchBtn').on('click', function() {
    location.reload();
})

// Event listener on input form ~ Runs get info 

// $("#get-info").on("click", getInfo);
$(document).on("click", "#get-info", getInfo);
