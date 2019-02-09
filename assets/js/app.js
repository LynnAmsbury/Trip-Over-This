

// Code for using Eventful API
var city = '';
var keyword = '';
var queryURLEventful = '';
var date = '';

function renderEvents(e) {
    e.preventDefault();
    city = $("#city-name").val().trim();
    keyword = $("#keyword").val().trim();
    date = $('#date').val();
    var apiKey = 'TnjCPgZgrN3KH5Vb';
    queryURLEventful = `https://api.eventful.com/json/events/search?app_key=${apiKey}&location=${city}&date=Today`;

    // Conditionals allowing for certain input to be optional
    if (keyword) {
        queryURLEventful = `https://api.eventful.com/json/events/search?app_key=${apiKey}&keywords=${keyword}&location=${city}&date=Future`;
    }

    if (date !== "Today") {
        queryURLEventful = `https://api.eventful.com/json/events/search?app_key=${apiKey}&location=${city}&date=${date}`;
    }

    if (date !== "Today" && keyword) {
        queryURLEventful = `https://api.eventful.com/json/events/search?app_key=${apiKey}&location=${city}&date=${date}`;
    }

    // Call to Eventful API
    $.ajax({
        // ***Lines 32 - 34 are an attempt at avoiding CORS within the call - need assistance in class***
        // beforeSend: function(request) {
        // request.setRequestHeader('Access-Control-Allow-Origin', '*');
        // },
        url: queryURLEventful,
        method: "GET"
    }).then(function(response){
        response = JSON.parse(response);
        // Response returns an object, within object is all events in an array (10 at a time, though I believe you can add more)
        console.log(response);
        for (var i=0; i < response.events.event.length; i++) {
            // Check titles of events
            console.log(response.events.event[i].title);
            // div to hold each new event
            var newEvent = $("<div>");
            // Event Title
            var title = $("<p>");
            title.html(`Event Title: ${response.events.event[i].title}`);
            // Event Location - city, state, zip
            // **Note on Location - would need to add conditional for zip code since sometimes it is null
            var location = $("<p>");
            location.html(`Location: ${response.events.event[i].city_name}, ${response.events.event[i].region_abbr}, ${response.events.event[i].postal_code}`);
            // Event Time - needs to be converted (maybe with Moment.js)
            // **Note on time - sometimes returns past events when searching for events marked "Today"
            var time = $("<p>");
            time.html(`Time and date: ${response.events.event[i].start_time}`);
            // External link leads to the event posting on Eventful's website
            var link = $("<a>");
            link.attr("href", response.events.event[i].url);
            link.text("See Event");
            link.attr("target", "_blank");
            // Following variables create new form (currently inactive)
            var newInput = $("<label>");
            var distContent = $("<input>");
            var distBtn = $("<input>");
            newInput.attr("for", "distance");
            distContent.attr("type", "text");
            distContent.attr("id", "distance");
            distBtn.attr("type", "submit");
            distBtn.attr("id", "get-restaurants");
            // Text for new form
            // the idea here is that users will enter a number to represent miles
            // this will be added to an API call for restaurants in the area
            // tentative depending on what we want 2nd API to do
            newInput.html(` Find restaurants within `);
            newInput.append(distContent, ` miles of this event. `, distBtn);
            newEvent.append(title, location, time, link, newInput);
            // Appends all to empty div
            $("#events").append(newEvent);
        }
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