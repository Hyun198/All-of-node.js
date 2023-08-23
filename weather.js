const axios = require('axios');
require('dotenv').config();

async function getWeather(city, apiKey) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const weatherData = response.data;
        return weatherData;
    } catch (error) {
        weather = null;
        return error;

    }
}
//this is update
module.exports = { getWeather };