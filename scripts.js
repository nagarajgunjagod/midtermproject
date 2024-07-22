document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
});

document.getElementById('current-location-btn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherDataByCoords(latitude, longitude);
        });
    } else {
        alert('Geolocation is not supported by this browser');
    }
});

function fetchWeatherData(city) {
    const apiKey = '97e98d56ae804112938165627242207';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    console.log(fetch(url).json);
    fetch(url)
    
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            fetchExtendedForecast(data.location.lat, data.location.lon);
        })
        
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data');
        });
}

function fetchWeatherDataByCoords(lat, lon) {
    const apiKey = '97e98d56ae804112938165627242207';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            fetchExtendedForecast(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data');
        });
}

function displayWeatherData(data) {
    const weatherResult = document.getElementById('weather-result');
    weatherResult.innerHTML = `
        <div class="flex justify-center">
        <div>
        <h2 class="text-2xl font-bold">${data.location.name}</h2>
        <div class="justify-items-start">
        <p>Temperature: ${data.current.temp_c} °C</p>
        <p>Humidity: ${data.current.humidity} %</p>
        <p>Wind Speed: ${data.current.wind_kph} kph</p>
        <p>Weather: ${data.current.condition.text}</p>
        </div>
        </div>
        <div class=" content-center">
        <img src="${data.current.condition.icon}" alt="">
        
        </div>
        </div>
    `;
}

function fetchExtendedForecast(lat, lon) {
    const apiKey = '97e98d56ae804112938165627242207';
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=no&alerts=no`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayExtendedForecast(data);
        })
        .catch(error => {
            console.error('Error fetching extended forecast:', error);
            alert('Error fetching extended forecast');
        });
}

function displayExtendedForecast(data) {
    const extendedForecast = document.getElementById('extended-forecast');
    extendedForecast.innerHTML = '<h2 class="text-2xl font-bold mb-4">5-Day Forecast</h2>';
    
    const forecastContainer = document.createElement('div');
    forecastContainer.className = 'grid grid-cols-1 md:grid-cols-5 gap-4'; // 5 columns on larger screens

    data.forecast.forecastday.forEach((item, index) => {
        const date = new Date(item.date);
        const forecastTile = document.createElement('div');
        forecastTile.className = `p-4 border rounded bg-white bg-opacity-70 shadow-lg`;
        forecastTile.innerHTML = `
            <p class="font-bold">${date.toDateString()}</p>
            <div class="flex justify-center content-center">
        <img src="${data.current.condition.icon}" alt="">
        
        </div>
            <p>Temperature: ${item.day.avgtemp_c} °C</p>
            <p>Humidity: ${item.day.avghumidity} %</p>
            <p>Wind Speed: ${item.day.maxwind_kph} kph</p>
            <p>Weather: ${item.day.condition.text}</p>
        `;
        forecastContainer.appendChild(forecastTile);
    });

    // Append the container to the extended forecast section
    extendedForecast.appendChild(forecastContainer);
}

