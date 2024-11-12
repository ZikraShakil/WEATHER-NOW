async function getWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }
  
    // Clear previous error messages
    document.getElementById("error-message").innerText = "";
  
    // Check cache
    const cachedWeather = localStorage.getItem(city.toLowerCase());
    if (cachedWeather) {
        displayWeather(JSON.parse(cachedWeather));
        return;
    }
  
    try {
        // Step 1: Fetch coordinates using Positionstack API
        const geoResponse = await fetch(`http://api.positionstack.com/v1/forward?access_key=1f15455ffe8ec3e5223231d09883c09b&query=${city}`);
        const geoData = await geoResponse.json();
  
        // Check Positionstack GeoData response
        console.log("Positionstack GeoData:", geoData);
  
        if (!geoData || !geoData.data || geoData.data.length === 0) {
            throw new Error("Location not found. Please enter a valid city name.");
        }
  
        const { latitude, longitude } = geoData.data[0];
  
        // Check if latitude and longitude are valid
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  
        if (latitude === undefined || longitude === undefined) {
            throw new Error("Coordinates not found for this city.");
        }
  
        // Step 2: Fetch weather data using Open-Meteo API
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherResponse.json();
  
        // Check Open-Meteo Weather Data response
        console.log("Open-Meteo Weather Data:", weatherData);
  
        if (!weatherData || !weatherData.current_weather) {
            throw new Error("Weather data not found for this location.");
        }
  
        // Cache the weather data
        localStorage.setItem(city.toLowerCase(), JSON.stringify(weatherData.current_weather));
  
        // Display weather information
        displayWeather(weatherData.current_weather);
  
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("error-message").innerText = 
            "Unable to fetch weather data. Please check your input or try again later.";
    }
  }
  
  // Function to display weather information
  function displayWeather(weather) {
    // Log weather data being displayed
    console.log("Displaying weather data:", weather);
  
    document.getElementById("temperature").innerText = `Temperature: ${weather.temperature ? weather.temperature + "°C" : "N/A"}`;
    document.getElementById("humidity").innerText = `Humidity: ${weather.relative_humidity !== undefined ? weather.relative_humidity + "%" : "N/A"}`;
    document.getElementById("wind-speed").innerText = `Wind Speed: ${weather.windspeed ? weather.windspeed + " m/s" : "N/A"}`;
  }
  