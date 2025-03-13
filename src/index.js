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
  const apikey = "9d3e36b607d79ba759dd3e5786fc583c";

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
    console.log(data);

    return { forecastMain, forecastDesc, forecastTemp };
  } catch (error) {
    console.error("error with current weather API:", error.message);
    throw error;
  }
};

const getWeeklyForecaset = async () => {
  const apikey = "9d3e36b607d79ba759dd3e5786fc583c";
  let sortingArray = [];
  let weatherArray = [];

  //   get curret date
  let currentDate = new Date().toJSON().slice(0, 10);

  try {
    const coords = await userCoordinates();
    const lat = coords.latitude;
    const lon = coords.longitude;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error("Response status: ", response.status);
    }

    const data = await response.json();

    const weekForecast = data.list;

    // loop through list of days
    // find and extract the objects with 12pm or after. Push to array and append the next day on the date.
    weekForecast.forEach((element) => {
      if (element.dt_txt === `${currentDate} 12:00:00`) {
        weatherArray.push(element);

        // append next day
        let dateObj = new Date(currentDate);
        dateObj.setDate(dateObj.getDate() + 1);
        currentDate = dateObj.toJSON().slice(0, 10);
      } else if (element.dt_txt >= `${currentDate} 12:00:00`) {
        weatherArray.push(element);

        // append next day
        let dateObj = new Date(currentDate);
        dateObj.setDate(dateObj.getDate() + 1);
        currentDate = dateObj.toJSON().slice(0, 10);
      }
    });

    console.log("weather array: ", weatherArray);

    return weatherArray;
  } catch (error) {
    console.error("error with 5 day forecast API:", error.message);
    throw error;
  }
};

const getForecastWithName = async () => {};

const getLocalName = async () => {
  const apikey = "9d3e36b607d79ba759dd3e5786fc583c";

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
    console.log(cityData);

    return cityName;
  } catch (error) {
    console.error("error with reversecoding API:", error.message);
    throw error;
  }
};

getForecast();
getLocalName();
getWeeklyForecaset();
