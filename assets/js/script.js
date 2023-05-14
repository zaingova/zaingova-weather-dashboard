var savedSearch = JSON.parse(localStorage.getItem("weather-search")) || [];
var city;

// adds event listener to the 'form=submit' action
document.getElementById('city-form').addEventListener('submit', function (event) {
    // prevents default
    event.preventDefault();

    // gets the value from the search bar and saves it in a variable
    city = document.getElementById('search-city').value;
    console.log(savedSearch);

    // calls daily forecast and 5-day forecast functions
    getForecast(city);
    getFiveDayForecast(city);
});

// function that returns the city data object from the API, creates page elements, and inserts said data into them
function getForecast(city) {
    // personal openweather API key
    const apikey = '3949445c5dde9639543fd0264505cbd4';

    // fetch request using the specified city and the API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)
        // returns response
        .then(function (response) {

            // if a valid city is not entereed, ie anything that results in an error, sends an alert
            if (response.status == 400 || response.status == 404) {
                window.alert("Please enter a valid city");
                return;
            } else {
                // otherwise, add city to local storage and render search history
                savedSearch.push(city);
                localStorage.setItem("weather-search", JSON.stringify(savedSearch));
                renderHistory(savedSearch);
                return response.json()
            }
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
            cityCurrentWind.textContent = "Current Wind-Speed: " + apiData.wind.speed + " km/h";
            cityCurrentHumidity.textContent = "Current Humidity: " + apiData.main.humidity + "%";

            cityCurrentTemp.setAttribute("style", "padding-bottom: 0");
            cityCurrentWind.setAttribute("style", "padding-bottom: 0px");
            cityCurrentHumidity.setAttribute("style", "padding-bottom: 0px");

            // section styling
            sectionEl.setAttribute("style", "border: 1px dashed black; padding: 1rem 5rem 1rem 1rem; margin-left: 20px; background-color: #e8f0fe");

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

// renders the local storage search history to the screen, as buttons
function renderHistory(savedSearch) {
    // section element -> new section element; hitoryEl is an array which will store buttons
    var sectionEl = document.createElement("section");
    var historyEl = [];

    sectionEl.textContent = "";

    // loops through local storage (the values of which are saved into another array)
    for (var i = 0; i < savedSearch.length; i++) {
        if (i < 10) {
            historyEl[i] = document.createElement("button");
            historyEl[i].textContent = savedSearch[i];
            historyEl[i].setAttribute("style", "width: 100%");
            historyEl[i].classList = "btn-lg btn-light history-btn";
            sectionEl.prepend(historyEl[i]);

            historyEl[i].addEventListener('click', function (event) {
                event.preventDefault();

                // gets the value from the history element and saves it in a variable
                city = this.textContent;

                // updates daily and 5-day forecast
                getForecast(city);
                getFiveDayForecast(city);
            })
        }
    }

    document.querySelector("#history").innerHTML = "";
    document.querySelector("#history").append(sectionEl);
}

renderHistory(savedSearch);


