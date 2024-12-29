import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from "axios"


import Clouds from "./Images/cloudy.jpg"
import Clear from "./Images/Sunny.jpg"
import Haze from "./Images/cloudy.jpg"
import Rain from "./Images/Rainy.jpg"
import Smoke from "./Images/Smog.jpg"


function Weather() {

    const [city, setCity] = useState("")
    const [weatherData, setWeatherData] = useState(null)
    const [error, setError] = useState("")
    const [dateTime, setDateTime] = useState("")
    const [backGroundImg, setBackGroundImg] = useState(null)

    const myApiKey = "eddac3d09c161a497ef46be83eff5dc1"

    const myApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${myApiKey}`


    const apiData = async (postApi) => {

        try {
            const dataApi = await axios.get(postApi)
            const newData = await dataApi.data
            const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000; // UTC time in ms
            const localTimeInMs = utcTime + newData.timezone * 1000; // Adjust with timezone offset
            const localDate = new Date(localTimeInMs);
            setDateTime(localDate.toLocaleString());
            const condition = newData?.weather[0].main;
            if (condition === "Haze") {
                setBackGroundImg(Haze)
            } else if (condition === "Clear") {
                setBackGroundImg(Clear)
            } else if (condition === "Smoke") {
                setBackGroundImg(Smoke)
            } else if (condition === "Rain") {
                setBackGroundImg(Rain)
            } else if (condition === "Clouds") {
                setBackGroundImg(Clouds)
            }
            console.log(newData)
            console.log("weatherData :", weatherData)
            setWeatherData(newData)
            console.log("weatherData :", weatherData)
        } catch (err) {
            console.log(err.message)
            setError(err.message)
        }
    }

    const fetchDataCurrentLocation = async (lat, lon) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${myApiKey}`
            );
            const newData = response.data
            const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
            const localTimeInMs = utcTime + newData.timezone * 1000;
            const localDate = new Date(localTimeInMs);
            setDateTime(localDate.toLocaleString())
            const condition = newData?.weather[0].main;
            if (condition === "Haze") {
                setBackGroundImg(Haze)
            } else if (condition === "Clear") {
                setBackGroundImg(Clear)
            } else if (condition === "Smoke") {
                setBackGroundImg(Smoke)
            } else if (condition === "Rain") {
                setBackGroundImg(Rain)
            } else if (condition === "Clouds") {
                setBackGroundImg(Clouds)
            }
            setWeatherData(newData);
            console.log(newData)
        } catch (err) {
            alert("Unable to fetch weather data for your location.");
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchDataCurrentLocation(latitude, longitude);
                },
                (err) => {
                    alert("Please enable location access to get current weather.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleCitySearch = (e) => {
        e.preventDefault()
        apiData(myApi)
        setCity("")
    }

    return (
        <>
            <body>

                <div className="weather-app"
                    style={{
                        backgroundImage: `url(${backGroundImg})`,
                        backgroundPosition: "cover",
                        height: "100vh",
                        backgroundRepeat: "no-repeat"

                    }}>
                    <div className='heading'><h3>Weather App</h3></div>
                    <form className="search-bar" onSubmit={handleCitySearch}>
                        <input type="text" id="city" placeholder="Search for a city" value={city} onChange={(e) => setCity(e.target.value)} />
                        <button>Search</button>
                    </form>

                    <div className="location">{weatherData?.name}-{weatherData?.sys.country}</div>
                    <div className="date">{dateTime}</div>

                    <div className="weather-info">
                        <div className="temperature">{Math.floor(`${weatherData?.main.temp}`)}°C / <span>{Math.floor(`${weatherData?.main.temp * 9 / 5 + 32}`)}°F</span></div>

                        <div className="icon">
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@2x.png`}
                                alt={weatherData?.weather[0].description}
                            />
                        </div>
                        <div className="description">{weatherData?.weather[0].description}</div>
                    </div>

                    <div className="details">
                        <div>Humidity: <span>{weatherData?.main.humidity} %</span></div>
                        <div>Wind: <span> {weatherData?.wind.speed} km/h</span></div>
                    </div>
                    <div className="details2">
                        <div>Temp-Max: <span>{weatherData?.main.temp_max} %</span></div>
                        <div>Temp-Min: <span> {weatherData?.main.temp_min} km/h</span></div>
                    </div>
                </div>

            </body>

        </>
    )
}

export default Weather
