export const cityForecast = () => {
  const contentContainer = document.querySelector(".content-format");
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.className = "input-search";
  inputText.placeholder = "city/country";

  const searchHeading = document.createElement("div");
  searchHeading.className = "search-heading";
  searchHeading.innerHTML = "Search Weather Forecast by City or Country";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "submit-btn";
  submitBtn.innerHTML = "search";

  const errorText = document.createElement("div");

  const searchContainer = document.createElement("form");
  const resultsContainer = document.createElement("div");
  searchContainer.className = "search-container";
  resultsContainer.className = "results-container";

  const locationTitle = document.createElement("div");

  contentContainer.appendChild(searchContainer);
  contentContainer.appendChild(resultsContainer);
  searchContainer.appendChild(searchHeading);
  searchContainer.appendChild(inputText);
  searchContainer.appendChild(submitBtn);
  searchContainer.appendChild(errorText);
  resultsContainer.appendChild(locationTitle);

  const createCard = (desc, temp) => {
    const weatherCard = document.createElement("div");
    weatherCard.className = "weather-card";

    const weatherDesc = document.createElement("div");
    weatherDesc.innerHTML = desc;
    const weatherTemp = document.createElement("div");
    weatherTemp.innerHTML = `${temp}&deg C`;

    resultsContainer.appendChild(weatherCard);
    weatherCard.appendChild(weatherTemp);
    weatherCard.appendChild(weatherDesc);
  };

  searchContainer.addEventListener("submit", async (event) => {
    event.preventDefault();

    const output = await getForecastWithName(inputText.value);

    if (output === null) {
      errorText.innerHTML = "City/Country inputed doesn't exist";
      locationTitle.innerHTML = "";
    } else {
      errorText.innerHTML = "";
      resultsContainer.innerHTML = "";
      locationTitle.innerHTML = output.name;
      createCard(output.weather[0].description, output.main.temp);
    }
  });
};

const getForecastWithName = async (name) => {
  const apikey = process.env.API_KEY;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=${apikey}`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error("Response Status: ", response.status);
    }

    // current weather
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("error with current weather API:", error.message);
    return null;
  }
};
