export const userForecast = async () => {
  const contentContainer = document.querySelector(".content-format");

  const createCard = (desc, temp) => {
    const weatherCard = document.createElement("div");
    weatherCard.className = "weather-card";

    const weatherDesc = document.createElement("div");
    weatherDesc.innerHTML = desc;
    const weatherTemp = document.createElement("div");
    weatherTemp.innerHTML = `${temp}&deg C`;

    contentContainer.appendChild(weatherCard);
    weatherCard.appendChild(weatherTemp);
    weatherCard.appendChild(weatherDesc);
  };

  const locationTitle = document.createElement("div");
  const errorMsg = document.createElement("div");
  contentContainer.appendChild(errorMsg);

  const forecast = await getForecast();
  const localeName = await getLocalName();

  if (forecast === null) {
    errorMsg.innerHTML = "Missing user location";
    locationTitle.innerHTML = "";
  } else {
    contentContainer.innerHTML = "";
    locationTitle.innerHTML = localeName.cityName;
    contentContainer.appendChild(locationTitle);
    createCard(forecast.forecastDesc, forecast.forecastTemp);
  }
};

const userCoordinates = async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation is no support by this browser."));
      }
    });

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    return { latitude, longitude };
  } catch (error) {
    console.error("error fetching location:", error.message);
    throw error;
  }
};

const getForecast = async () => {
  const apikey = process.env.API_KEY;

  try {
    const coords = await userCoordinates();
    const lat = coords.latitude;
    const lon = coords.longitude;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error("Response Status: ", response.status);
    }

    // current weather
    const data = await response.json();
    const forecastMain = data.weather[0].main;
    const forecastDesc = data.weather[0].description;
    const forecastTemp = data.main.temp;

    return { forecastMain, forecastDesc, forecastTemp };
  } catch (error) {
    console.error("error with current weather API:", error.message);
    throw error;
  }
};

const getLocalName = async () => {
  const apikey = process.env.API_KEY;

  try {
    const coords = await userCoordinates();
    const lat = coords.latitude;
    const lon = coords.longitude;

    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apikey}`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error("Response Status: ", response.status);
    }

    const cityData = await response.json();
    const cityName = cityData[0].name;

    return { cityName };
  } catch (error) {
    console.error("error with reversecoding API:", error.message);
    throw error;
  }
};
