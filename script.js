document.querySelector('.search-btn').addEventListener('click', () => {
  const city = document.querySelector('.city-input').value;
  fetchWeatherData(city);
});

document.querySelector('.location-btn').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition((position) => {
      fetchWeatherData(null, position.coords.latitude, position.coords.longitude);
  });
});

function fetchWeatherData(city, lat = null, lon = null) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=e301f11b0dd3de081c07d81d3c7df1a6&units=metric`;
  if (lat && lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=e301f11b0dd3de081c07d81d3c7df1a6&units=metric`;
  }

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          updateCurrentWeather(data);
          updateHourlyForecast(data);
          updateFiveDayForecast(data);
      })
      .catch(error => console.error('Error fetching weather data:', error));
}

console.log('Hello World!');
function updateCurrentWeather(data) {
  console.log('API Response:', data); // Log the entire API response
  const cityName = data.city.name;
  const country = data.city.country;
  const temperature = data.list[0].main.temp;
  const windSpeed = data.list[0].wind.speed;
  const humidity = data.list[0].main.humidity;
  const weatherDescription = data.list[0].weather[0].description;
  const weatherIcon = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@4x.png`;

  document.querySelector('.details h2').textContent = `${cityName} (${country})`;
  document.querySelector('.details h6:nth-of-type(1)').textContent = `Temperature: ${temperature}°C`;
  document.querySelector('.details h6:nth-of-type(2)').textContent = `Wind: ${windSpeed} M/S`;
  document.querySelector('.details h6:nth-of-type(3)').textContent = `Humidity: ${humidity}%`;
  document.querySelector('.icon img').src = weatherIcon;
  document.querySelector('.icon h6').textContent = weatherDescription;

  setBackgroundColor(temperature);
}

function updateHourlyForecast(data) {
  const hourlyCardsContainer = document.querySelector('.hourly-cards');
  hourlyCardsContainer.innerHTML = ''; // Clear previous data

  // Loop through the first 5 hours of forecast data
  for (let i = 0; i < 9; i++) {
      const forecast = data.list[i];
      const time = new Date(forecast.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const temperature = forecast.main.temp;
      const windSpeed = forecast.wind.speed;
      const humidity = forecast.main.humidity;
      const weatherIcon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`;

      const card = document.createElement('li');
      card.classList.add('card');
      card.innerHTML = `
          <h3>${time}</h3>
          <img src="${weatherIcon}" alt="weather-icon">
          <h6>Temp: ${temperature}°C</h6>
          <h6>Wind: ${windSpeed} M/S</h6>
          <h6>Humidity: ${humidity}%</h6>
      `;
      hourlyCardsContainer.appendChild(card);
  }
}


function updateFiveDayForecast(data) {
  const fiveDayCardsContainer = document.querySelector('.weather-cards');
  fiveDayCardsContainer.innerHTML = ''; // Clear previous data

  // Extracting a forecast for each day at 12:00 PM
  const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));
  dailyForecasts.forEach((forecast) => {
      const date = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
      const temperature = forecast.main.temp;
      const windSpeed = forecast.wind.speed;
      const humidity = forecast.main.humidity;
      const weatherIcon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`;

      const card = document.createElement('li');
      card.classList.add('card');
      card.innerHTML = `
          <h3>${date}</h3>
          <img src="${weatherIcon}" alt="weather-icon">
          <h6>Temp: ${temperature}°C</h6>
          <h6>Wind: ${windSpeed} M/S</h6>
          <h6>Humidity: ${humidity}%</h6>
      `;
      fiveDayCardsContainer.appendChild(card);
  });
}

function setBackgroundColor(temperature) {
  let color;

  if (temperature <= 0) {
      color = '#D0EFFF'; // Freezing Cold (light blue)
  } else if (temperature > 0 && temperature <= 15) {
      color = '#AEECEF'; // Cold (soft teal)
  } else if (temperature > 15 && temperature <= 25) {
      color = '#FFF9C4'; // Cool (light yellow)
  } else if (temperature > 25 && temperature <= 35) {
      color = '#FFDAB9'; // Warm (soft peach)
  } else {
      color = '#FFC1C1'; // Hot (light coral)
  }

  document.body.style.backgroundColor = color;
}


