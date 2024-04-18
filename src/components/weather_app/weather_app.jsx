import React, { useState, useEffect } from "react";
import './weather_app.css';


import searchIcon from '../assets/search-icon.png';
import cloudIcon from '../assets/sunny.png';
import humidityIcon from '../assets/cloud_13994511.png';
import windIcon from '../assets/wind_4161237.png';
import clearIcon from '../assets/clear_sky.png';
import mistIcon from '../assets/mist.png';
import rainIcon from '../assets/rain_day.png';
import snowIcon from '../assets/snow.png';
import scattered_cloudIcon from "../assets/scattered_cloud_day.png";
import Thunder_stormIcon from "../assets/thunderstorm.png";


const WeatherApp = () => {

    const [weatherData, setWeatherData] = useState(null);
    const [weatherIcon, setWeatherIcon] = useState(cloudIcon);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const position = await getCurrentPosition();
                const { latitude, longitude } = position.coords;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_API_KEY}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = await response.json();
                setWeatherData(data);
                updateWeatherIcon(data.weather[0].icon);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };
        fetchData();
    }, []);

    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    const updateWeatherIcon = (icon) => {
        switch (icon) {
            case "01d":
            case "01n":
                setWeatherIcon(clearIcon);
                break;
            case "02d":
            case "02n":
                setWeatherIcon(cloudIcon);
                break;
            case "03d":
            case "03n":
            case "04d":
            case "04n":
                setWeatherIcon(scattered_cloudIcon);
                break;
            case "09d":
            case "09n":
            case "10d":
            case "10n":
                setWeatherIcon(rainIcon);
                break;
            case "11d":
            case "11n":
                setWeatherIcon(Thunder_stormIcon);
                break;
            case "13d":
            case "13n":
                setWeatherIcon(snowIcon);
                break;
            case "50d":
            case "50n":
                setWeatherIcon(mistIcon);
                break;
            
            default:
                setWeatherIcon(cloudIcon);
        }
    };

    const search = async () => {
        const element = document.getElementsByClassName('cityInput');
        
        if (element[0].value === "") {
            return; // If the input is empty, do nothing
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${process.env.REACT_APP_API_KEY}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const data = await response.json();
            setWeatherData(data);
            updateWeatherIcon(data.weather[0].icon);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    return (
        <div className="container">
            <div className="top-bar">
                <input type="text" className="cityInput" placeholder="Search..."></input>
                <div className="search-icon" onClick={search}>
                    <img src={searchIcon} alt="Search"></img>
                </div>
            </div>
            <div className="weather-image">
                <img src={weatherIcon} alt="Weather Icon"></img>
            </div>
            <div className="description">{weatherData && weatherData.weather[0].description}</div>
            <div className="weather-temp">{Math.floor(weatherData && weatherData.main.temp)}°c</div>
            <div className="weather-location">{weatherData && weatherData.name}</div>
            <div className="data-container">
                <div className="details">
                    <img src={humidityIcon} alt="Humidity" className="icon"></img>
                    <div className="weather-data">
                        <div className="humidity-percent">{weatherData && weatherData.main.humidity}%</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>
                <div className="details">
                    <img src={windIcon} alt="Wind Speed" className="icon"></img>
                    <div className="weather-data">
                        <div className="wind-percent">{Math.floor(weatherData && weatherData.wind.speed)}km/h</div>
                        <div className="text">Wind Speed</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherApp;
