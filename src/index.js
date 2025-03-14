import "./styles.css";
import { cityForecast } from "./city-forecast";
import { userForecast } from "./user-forecast";
import { weekForecast } from "./week-forecast";

const clearPage = () => {
  const content = document.querySelector(".content-format");
  content.innerHTML = "";
};

const navigation = () => {
  document.getElementById("home-tab").addEventListener("click", (event) => {
    event.preventDefault();
    clearPage();
    cityForecast();
  });

  document.getElementById("day-tab").addEventListener("click", (event) => {
    event.preventDefault();
    clearPage();
    userForecast();
  });

  document.getElementById("week-tab").addEventListener("click", (event) => {
    event.preventDefault();
    clearPage();
    weekForecast();
  });
};

window.onload = () => {
  navigation();
  cityForecast();
};
