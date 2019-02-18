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

// Saving Firebase to var for use
var database = firebase.database();

// Variables for SeatGeek API
var city = '';
var eventKeyword = '';
var eventDateStart = '';
var eventDateEnd = '';
var queryURLEvents = '';
let cityCode = '';

// Sad sound bite plays to remind user that their travel plans are depressing
var sadSound = $("<audio>");
sadSound.attr("src", "assets/womp-womp.mp3");

// Function runs 3 API calls, appends info to page ~ Runs when div with #get-info is clicked
function getInfo() {    
    // getting info from user input and saving to variables
    city = $("#city-events").val().trim();
    eventDateStart = $("#event-start").val();
    eventDateEnd = $("#event-end").val();

    // Saving data to Firebase
    database.ref().set({
        recentCity: city,
        eventDateStart: eventDateStart,
        eventDateEnd: eventDateEnd
    });

    // Seatgeek API key
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
            queryURLEvents = `https://api.seatgeek.com/2/events?client_id=${apiKey}&venue.city=${city}&datetime_local.gte=${eventDateStart}&datetime_local.lte=${eventDateEnd}&per_page=10`;
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
                let newEvent = $('<div>');
                let image = $('<img>');
                let body = $('<div>');
                let title = $('<h5>');
                let location = $('<p>');
                let date = $('<p>');
                let link = $('<a>');
                // Add classes
                newEvent.addClass('card border-0 shadow-lg eventDiv');
                image.addClass('card-img-top eventImg');
                body.addClass('card-body');
                title.addClass('card-title');
                location.addClass('card-text');
                date.addClass('card-text');
                link.addClass('btn btn-primary');
                // Event title
                title.text(data.events[i].title);
                // Event location (venue)
                location.text(data.events[i].venue.name);
                // Event Date & Time
                var dateTime = data.events[i].datetime_local;
                dateTime = moment(dateTime).format("MMM Do h:mm A");
                date.text(dateTime);
                // Event image from seatgeek
                // if seatgeek image does not exist, replace image source with angry face placeholder
                if (data.events[i].performers[0].image === null) {
                    image.attr("src", "assets/images/angry.png");
                } else {
                    image.attr("src", data.events[i].performers[0].image);
                }
                // Event link on seatgeek site ~ p tag added for div positioning
                link.attr("href", data.events[i].url);
                link.attr("target", "_blank");
                link.text("More info");
                // Append it all to empty div
                newEvent.append(image, body);
                body.append(title, location, date, link);
                // Append that to event column
                $("#eventData").append(newEvent);
            }
        });

        // Variables for Zomato call - getting city code
        let cityName = city;
        let queryURLCity = `https://developers.zomato.com/api/v2.1/locations?query=${cityName}`;
        
        // AJAX call to Zomato
        $.ajax({
            url: queryURLCity,
            method: 'GET',
            beforeSend: function(request) {
                request.setRequestHeader("Accept", "application/json");
                request.setRequestHeader("user-key", "262af377ee8926dc56eff941cea5b5e1");
            },
        }).then(function(data){
            // saving city code to use in next call
            cityCode = data.location_suggestions[0].city_id;
            // nesting second call within the first response
            cityCodeAJAX();
        });

        // Toggles display of input form
        hideAndShow(); 
    } else { // runs if user doesn't enter a city or date range
        $("#error-message").text("Please enter a city and date range.");
    }
}

// Function displays info from Firebase on page
database.ref().on("value", function(snapshot) {
    // Change the HTML to reflect
    $("#city").text(`Recent Search: ${snapshot.val().recentCity}`);
    $("#endDate").text(snapshot.val().recentEndDate);
    $("#startDate").text(snapshot.val().recentStartDate);

    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


// AJAX call for Zomato - get breweries using city code from previous call
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
            let linkToSite = $('<a>')
            // Add classes
            newCard.addClass('card border-0 shadow-lg');
            newImg.addClass('card-img-top');
            newBody.addClass('card-body');
            newTitle.addClass('card-title');
            newText.addClass('card-text');
            newLike.addClass('btn btn-primary');
            linkToSite.addClass('btn btn-primary');
            // Add text
            if (!resultsArr[i].restaurant.featured_image) {
                newImg.attr("src", "assets/images/angry.png");
            } else {
                newImg.attr("src", resultsArr[i].restaurant.featured_image);
            }
            newTitle.text(restaurantName);
            linkToSite.attr('href', resultsArr[i].restaurant.url);
            linkToSite.attr('target', "_blank");
            linkToSite.text('Visit on Zomato');
            newLike.text('Like');
            newLike.attr('href', '#');

            // Add to DOM
            $('#restaurantData').append(newCard);
            newCard.append(newImg, newBody);
            newBody.append(newTitle, newText, newLike, linkToSite);
        }
    });
}

// Makes input form invisible while results are shown on the page
function hideAndShow() {
    // Hide search form
    $('#searchForm').addClass('d-none');
    // Make a button to search again
    $('#newSearchBtn').removeClass('d-none');
};

// Resets page so that user can search again
$('#newSearchBtn').on('click', function() {
    location.reload();
})

// Event listener on input form ~ Runs get info 
$(document).on("click", "#get-info", getInfo);
