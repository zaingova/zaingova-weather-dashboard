
// adds event listener to the 'form=submit' action
document.getElementById('city-form').addEventListener('submit', function (event) {
    // prevents default
    event.preventDefault();

    // gets the value from the search bar and saves it in a variable
    var city = document.getElementById('search-city').value;
    var savedSearch = JSON.parse(localStorage.getItem("weather-search")) || []

    console.log(city);
    getForecast(city);
    getFiveDayForecast(city);

    savedSearch.push(city)
    localStorage.setItem("weather-search", JSON.stringify(savedSearch))
    console.log(savedSearch);
});

// function that returns the city data object from the API, creates page elements, and inserts said data into them
function getForecast(city) {
    // personal openweather API key
    const apikey = '3949445c5dde9639543fd0264505cbd4';

    // fetch request using the specified city and the API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)
        // returns response
        .then(function (response) {
            return response.json()
        })

        .then(function (apiData) {
            // creates elements for the main city data
            var sectionEl = document.createElement("section")
            var cityNameEl = document.createElement("h2");
            var cityCurrentTemp = document.createElement("p");
            var cityCurrentWind = document.createElement("p");
            var cityCurrentHumidity = document.createElement("p");

            // sets name accordingly using the object returned from the API
            cityNameEl.textContent = apiData.name;
            // sets temp, wind-speed, and humidity using the same method
            cityCurrentTemp.textContent = "Current Temperature: " + apiData.main.temp + "°C";
            cityCurrentWind.textContent = "Current Wind-Speed: " +apiData.wind.speed + " km/h";
            cityCurrentHumidity.textContent = "Current Humidity: " +apiData.main.humidity + "%";

            cityCurrentTemp.setAttribute("style", "padding-left: 10px");
            cityCurrentWind.setAttribute("style", "padding-left: 10px");
            cityCurrentHumidity.setAttribute("style", "padding-left: 10px");

            // section styling
            sectionEl.setAttribute("style", "border: 1px dashed black; padding: 1rem 5rem 1rem 1rem; background-color: #e8f0fe");

            // adds each element to the main section
            sectionEl.appendChild(cityNameEl);
            sectionEl.appendChild(cityCurrentTemp);
            sectionEl.appendChild(cityCurrentWind);
            sectionEl.appendChild(cityCurrentHumidity);

            // adds the section to the main div
            document.querySelector("#city-data").innerHTML = "";
            document.querySelector("#city-data").append(sectionEl);
        })
}

// function that returns the city's 5-day forecast, creates page elements, and inserts said data into them
function getFiveDayForecast(city) {
    const apikey = '3949445c5dde9639543fd0264505cbd4';
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`)
        .then(function (response) {
            return response.json()
        })
        .then(function (apiData) {
            console.log(apiData);

            for (var i = 0; i < apiData.list.length; i += 8) {
                console.log(apiData.list[i]);
            }
        })
}

function renderHistory() {
    return;
}



