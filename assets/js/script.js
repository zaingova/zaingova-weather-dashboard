var savedSearch = JSON.parse(localStorage.getItem("weather-search")) || [];
var city;
var today = dayjs();
var sectionEl = document.createElement("section");

// adds event listener to the 'form=submit' action
document.getElementById('city-form').addEventListener('submit', function (event) {
    // prevents default
    event.preventDefault();

    // gets the value from the search bar and saves it in a variable
    city = document.getElementById('search-city').value;
    //console.log(savedSearch);

    // calls daily forecast and 5-day forecast functions
    renderForecasts(city);
});

// function to render both the daily and 5-day forecasts for a given city
function renderForecasts(city) {
    getForecast(city);
    getFiveDayForecast(city);
}

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
                savedSearch.unshift(city);
                localStorage.setItem("weather-search", JSON.stringify(savedSearch));
                renderHistory(savedSearch);
                return response.json()
            }
        })

        .then(function (apiData) {

            // current weather icon data
            var iconcode = apiData.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            // creates elements for the main city data
            var sectionEl = document.createElement("section")
            var cityNameEl = document.createElement("h2");
            var cityCurrentTemp = document.createElement("p");
            var cityCurrentWind = document.createElement("p");
            var cityCurrentHumidity = document.createElement("p");
            var iconEl = document.createElement("img");

            // sets name accordingly using the object returned from the API
            cityNameEl.textContent = apiData.name + " (" + today.format('MM-DD-YYYY') + ")";

            // sets temp, wind-speed, and humidity using the same method
            cityCurrentTemp.textContent = "Current Temperature: " + apiData.main.temp + "°C";
            cityCurrentWind.textContent = "Current Wind-Speed: " + apiData.wind.speed + " km/h";
            cityCurrentHumidity.textContent = "Current Humidity: " + apiData.main.humidity + "%";

            iconEl.setAttribute("src", iconurl);
            cityCurrentTemp.setAttribute("style", "margin-bottom: 0");
            cityCurrentWind.setAttribute("style", "margin-bottom: 0");
            cityCurrentHumidity.setAttribute("style", "margin-bottom: 0");

            // section styling
            sectionEl.setAttribute("style", "border: 1px dashed black; padding: 1rem 5rem 1rem 1rem; margin: 0 0px 0 20px; background-color: #e8f0fe");

            // adds each element to the main section
            cityNameEl.appendChild(iconEl);

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

        // testing loop: shows all data for each day, for the next 5 days
        .then(function (apiData) {

            // since the first for loop increases the index by 8 at a time, its easier to store each the API data in a separate array of 5
            var datesArray = [];

            for (var i = 0; i < apiData.list.length; i += 8) {
                datesArray.push(apiData.list[i]);
            }

            // loop goes to 5 because its a 5 day forecast and datesArray has an index no. of 5
            for (var n = 0; n < 5; n++) {
                var date = document.querySelector(".day" + (n + 1) + "Date");
                var icon = document.querySelector(".day" + (n + 1) + "Icon");
                var temp = document.querySelector(".day" + (n + 1) + "Temp");
                var wind = document.querySelector(".day" + (n + 1) + "Wind");
                var humidity = document.querySelector(".day" + (n + 1) + "Humidity");
                var sectionTitle = document.querySelector(".sectionTitle");

                // general styling
                document.querySelector("#day" + (n + 1)).setAttribute("style", "background-color: #f0f0f0; border-radius: " +
                    "40px; height: 270px; text-align: center; margin: 10px 20px 10px 20px; padding-right: 30px; border: 1px dashed black");
                document.querySelector("#five-day").setAttribute("style", "padding: 10px; margin: 35px 0 0 30px");
                document.querySelector(".right-panel-divider").setAttribute("style", "display: block");

                date.setAttribute("style", "padding-top: 33px; font-weight: bold; font-size: 20px");
                icon.setAttribute("style", "padding-bottom: 15px");
                sectionTitle.setAttribute("style", "text-align: center; font-size: 25px; margin-bottom: 30px; color: #000");

                // setting appropriate text content
                sectionTitle.textContent = "Five Day Forecast";
                date.textContent = (datesArray[n].dt_txt).substring(0, (datesArray[n].dt_txt).indexOf(" "));
                icon.setAttribute("src", "http://openweathermap.org/img/w/" + datesArray[n].weather[0].icon + ".png")
                temp.textContent = "Temp: " + datesArray[n].main.temp + "°C";
                wind.textContent = "Wind: " + datesArray[n].wind.speed + " km/h";
                humidity.textContent = "Humidity: " + datesArray[n].main.humidity + "%"
            }
        })
}

// renders the local storage search history to the screen, as buttons
function renderHistory(savedSearch) {
    // section element -> new section element; hitoryEl is an array which will store buttons
    var historyEl = [];
    sectionEl.textContent = "";

    // loops through local storage (the values of which are saved into another array)
    for (var i = 0; i < savedSearch.length; i++) {
        //Toronto
        if (i < 10) {
            historyEl[i] = document.createElement("button");
            historyEl[i].textContent = savedSearch[i];
            historyEl[i].setAttribute("style", "width: 100%");
            historyEl[i].classList = "btn-lg btn-light history-btn";
            sectionEl.append(historyEl[i]);

            historyEl[i].addEventListener('click', function (event) {
                event.preventDefault();

                // gets the value from the history element and saves it in a variable
                city = this.textContent;

                // updates daily and 5-day forecast
                renderForecasts(city);
                getFiveDayForecast(city);
            })
        } else {
            // shifts search results up by 1 on each loop after the first 10 results
            for (var n = 0; n < 10; n++) {
                historyEl[n].textContent = savedSearch[n];
            }
        }
    }

    document.querySelector("#history").innerHTML = "";
    document.querySelector("#history").append(sectionEl);
}

// automatically render search history
renderHistory(savedSearch);


