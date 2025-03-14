A frontend weather web application designed to demonstrate proficiency in using Promises and APIs. This app serves as a proof of concept for handling asynchronous operations and integrating third-party APIs, with a focus on functionality over visual design.

Features

- Real-Time Weather Data: Fetches and displays current weather information for a specified location.
- Asynchronous Operations: Utilizes JavaScript Promises to handle API requests and responses.
- API Integration: Connects to a weather API to retrieve and display data.
- Dynamic Updates: Updates the UI dynamically based on user input and API responses.

Technologies Used

- HTML: Structure of the web page.
- CSS: Basic styling (visually incomplete).
- JavaScript: Core functionality, including Promises and API integration.
- Webpack: Module bundler for managing dependencies and assets.
- Weather API: External API for fetching weather data (e.g., OpenWeatherMap).

App Functionality

- User can serach for the forecast of city/country using a search field
- Users local forecast based on their coordinates
- Users local 5 day forecast based on their coordinates

Installing Necessary Packages to Run

run following command to install necessary webpack packages:

```
npx webpack
```

install package to store api key:

```
npm install dotenv-webpack
```

create a .env file at the root of the project. Content of file should look like:

```
API_KEY=your_api_key_here
```

Weather API service used is https://openweathermap.org/

Run application:

```
npm run dev
```
