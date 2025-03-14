export const weekForecast = async () => {
  const contentContainer = document.querySelector(".content-format");
  const cardContainer = document.createElement("div");
  cardContainer.className = "card-container";

  const locationTitle = document.createElement("div");
  const errorMsg = document.createElement("div");
  contentContainer.appendChild(errorMsg);

  const createCard = (desc, temp, day) => {
    const weatherCard = document.createElement("div");
    weatherCard.className = "weather-card";

    const weatherDay = document.createElement("div");
    weatherDay.innerHTML = day;
    const weatherDesc = document.createElement("div");
    weatherDesc.innerHTML = desc;
    const weatherTemp = document.createElement("div");
    weatherTemp.innerHTML = `${temp}&deg C`;

    cardContainer.appendChild(weatherCard);
    weatherCard.appendChild(weatherDay);
    weatherCard.appendChild(weatherTemp);
    weatherCard.appendChild(weatherDesc);
    contentContainer.appendChild(cardContainer);
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const forecast = await getWeeklyForecaset();
  const localeName = await getLocalName();

  if (forecast === null) {
    errorMsg.innerHTML = "Missing user location";
    locationTitle.innerHTML = "";
  } else {
    contentContainer.innerHTML = "";
    locationTitle.innerHTML = localeName.cityName;
    contentContainer.appendChild(locationTitle);
    forecast.forEach((element) => {
      const getDate = new Date(element.dt_txt);
      const getDay = getDate.getDay();
      createCard(
        element.weather[0].description,
        element.main.temp,
        dayNames[getDay]
      );
    });
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

const getWeeklyForecaset = async () => {
  const apikey = process.env.API_KEY;
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

    return weatherArray;
  } catch (error) {
    console.error("error with 5 day forecast API:", error.message);
    return null;
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
