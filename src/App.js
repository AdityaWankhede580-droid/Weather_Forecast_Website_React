import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FirstApp.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const API_KEY = "5bd9f06663312a06d983cf30c2d96760"; 

  const getWeatherData = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      getWeatherData(position.coords.latitude, position.coords.longitude);
    });
  }, []); 

  const searchCity = async (e) => {
    if (e.key === 'Enter') {
      try {
        const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
        const geoRes = await axios.get(geoUrl);
        getWeatherData(geoRes.data.coord.lat, geoRes.data.coord.lon);
        setCity('');
      } catch (err) {
        alert("City not found!");
      }
    }
  };

  return (
    <div className="App">
      <div className="search-box">
        <input 
          type="text"
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          onKeyPress={searchCity}
          placeholder="Type city and press Enter..."
        />
      </div>
      
      {weather && (
        <div className="weather-info">
          <h1>{weather.city.name}</h1>
          <div className="temp">{Math.round(weather.list[0].main.temp)}°C</div>
          <p className="desc">{weather.list[0].weather[0].description}</p>
          
          <div className="forecast">
            {weather.list.filter((_, i) => i % 8 === 0).map((day, i) => (
              <div key={i} className="day-card">
                <p>{new Date(day.dt_txt).toLocaleDateString('en', {weekday: 'short'})}</p>
                <strong>{Math.round(day.main.temp)}°C</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;