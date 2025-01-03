// Get Weather Button Event Listener
document.getElementById('getWeatherBtn').addEventListener('click', function () {
    const city = document.getElementById('cityInput').value;
    const unit = document.getElementById('unitToggle').value;
    if (city === '') {
        alert('Please enter a city name');
        return;
    }

    // Clear previous data                                          
    clearWeatherData();

    // API Key and URLs
    const apiKey = '1294dcb5860146bd6597e1518767825a'; // Replace with your actual API key
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                document.getElementById('errorMessage').innerText = 'City not found';
                document.getElementById('errorMessage').style.display = 'block';
                return;
            }

            // Display current weather
            const temp = data.main.temp;
            const description = data.weather[0].description;
            const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            document.getElementById('temperature').innerText = `${temp}°`;
            document.getElementById('description').innerText = description;
            document.getElementById('weatherIcon').src = icon;
            document.getElementById('weatherIcon').style.display = 'inline';

            // Display city name
            document.getElementById('cityNameDisplay').innerText = data.name;

            // Update Map
            updateMap(lat, lon);

            // Call the updateBackground function to change the background based on weather
            updateBackground(description.toLowerCase());

            // Fetch 5-day forecast data
            return fetch(forecastUrl);
        })
        .then(response => response.json())
        .then(data => {
            const forecastList = document.getElementById('forecastList');
            forecastList.innerHTML = ''; // Clear previous forecast

            data.list.forEach((forecast, index) => {
                if (index % 8 === 0) { // Show forecast for each day (every 8th item)
                    const day = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    const temp = forecast.main.temp;
                    const description = forecast.weather[0].description;
                    const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('forecast-item');

                    forecastItem.innerHTML = `
                        <p>${day}</p>
                        <img src="${icon}" alt="${description}" />
                        <p>${temp}°</p>
                        <p>${description}</p>
                    `;
                    forecastList.appendChild(forecastItem);
                }
            });

            document.getElementById('forecast').style.display = 'block'; // Show forecast
        })
        .catch(error => {
            document.getElementById('errorMessage').innerText = 'Error fetching weather data';
            document.getElementById('errorMessage').style.display = 'block';
        });
});

// Get Current Location Weather Button Event Listener
document.getElementById('getLocationWeatherBtn').addEventListener('click', function () {
    // Clear previous data
    clearWeatherData();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const unit = document.getElementById('unitToggle').value;

            const apiKey = '1294dcb5860146bd6597e1518767825a'; // Replace with your actual API key
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

            // Fetch current weather data for current location
            fetch(currentWeatherUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.cod !== 200) {
                        document.getElementById('errorMessage').innerText = 'Unable to get weather data for current location';
                        document.getElementById('errorMessage').style.display = 'block';
                        return;
                    }

                    // Display current weather
                    const temp = data.main.temp;
                    const description = data.weather[0].description;
                    const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

                    document.getElementById('temperature').innerText = `${temp}°`;
                    document.getElementById('description').innerText = description;
                    document.getElementById('weatherIcon').src = icon;
                    document.getElementById('weatherIcon').style.display = 'inline';

                    // Display city name
                    document.getElementById('cityNameDisplay').innerText = data.name;

                    // Update Map
                    updateMap(lat, lon);

                    // Call the updateBackground function to change the background based on weather
                    updateBackground(description.toLowerCase());

                    // Fetch 5-day forecast data
                    return fetch(forecastUrl);
                })
                .then(response => response.json())
                .then(data => {
                    const forecastList = document.getElementById('forecastList');
                    forecastList.innerHTML = ''; // Clear previous forecast

                    data.list.forEach((forecast, index) => {
                        if (index % 8 === 0) { // Show forecast for each day (every 8th item)
                            const day = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            const temp = forecast.main.temp;
                            const description = forecast.weather[0].description;
                            const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

                            const forecastItem = document.createElement('div');
                            forecastItem.classList.add('forecast-item');

                            forecastItem.innerHTML = `
                                <p>${day}</p>
                                <img src="${icon}" alt="${description}" />
                                <p>${temp}°</p>
                                <p>${description}</p>
                            `;
                            forecastList.appendChild(forecastItem);
                        }
                    });

                    document.getElementById('forecast').style.display = 'block'; // Show forecast
                })
                .catch(error => {
                    document.getElementById('errorMessage').innerText = 'Error fetching current location weather';
                    document.getElementById('errorMessage').style.display = 'block';
                });
        }, function () {
            document.getElementById('errorMessage').innerText = 'Geolocation is not supported or permission denied';
            document.getElementById('errorMessage').style.display = 'block';
        });
    } else {
        document.getElementById('errorMessage').innerText = 'Geolocation is not supported by your browser';
        document.getElementById('errorMessage').style.display = 'block';
    }
});

// Helper function to clear previous data
function clearWeatherData() {
    document.getElementById('temperature').innerText = '';
    document.getElementById('description').innerText = '';
    document.getElementById('weatherIcon').style.display = 'none';
    document.getElementById('forecast').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('forecastList').innerHTML = ''; // Clear the forecast list
}

// Map functionality
let map;

function updateMap(lat, lon) {
    if (!map) {
        // Create the map if it doesn't exist
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    } else {
        // If the map already exists, update its view
        map.setView([lat, lon], 10);
    }

    // Add a marker to the map
    L.marker([lat, lon]).addTo(map)
        .bindPopup('City Location')
        .openPopup();
}

// Function to change the background based on weather
function updateBackground(weatherDescription) {
    const body = document.body;
    body.className = ""; // Reset any existing class

    console.log("Weather Description:", weatherDescription); // Log the description for debugging

    if (weatherDescription.includes("clear") || weatherDescription.includes("sun") || weatherDescription.includes("sky")) {
        body.classList.add("sunny");
    } else if (weatherDescription.includes("cloud") || weatherDescription.includes("overcast") || weatherDescription.includes("mist") || weatherDescription.includes("scattered") || weatherDescription.includes("broken") || weatherDescription.includes("few clouds") || weatherDescription.includes("fog") || weatherDescription.includes("haze") || weatherDescription.includes("smoke") || weatherDescription.includes("dust") || weatherDescription.includes("ash") || weatherDescription.includes("squall") || weatherDescription.includes("tornado") || weatherDescription.includes("sand")) {
        body.classList.add("cloudy");
    } else if (weatherDescription.includes("rain") || weatherDescription.includes("drizzle")) {
        body.classList.add("rainy");
    } else if (weatherDescription.includes("thunderstorm") || weatherDescription.includes("lightning")) {
        body.classList.add("stormy");
    } else if (weatherDescription.includes("snow")) {
        body.classList.add("snowy");
    } else {
        body.classList.add("default-weather");
    }

    console.log("Applied Class:", body.className); // Log applied class for debugging
}

