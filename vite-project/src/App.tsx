import { useState } from "react";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  windspeed: number;
  time: string;
}

function App() {

  const [city, setCity] =
    useState<string>("");

  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [error, setError] =
    useState<string>("");

  const [loading, setLoading] =
    useState<boolean>(false);

  const getWeather =
    async (): Promise<void> => {

      if (!city.trim()) {

        setError("Ingresa una ciudad");
        setWeather(null);

        return;
      }

      setLoading(true);
      setError("");

      try {

        const geoUrl =
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;

        const geoResponse =
          await fetch(geoUrl);

        const geoData =
          await geoResponse.json();

        if (
          !geoData.results ||
          geoData.results.length === 0
        ) {

          setError("Ciudad no encontrada");
          setWeather(null);
          setLoading(false);

          return;
        }

        const location =
          geoData.results[0];

        const weatherUrl =
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`;

        const weatherResponse =
          await fetch(weatherUrl);

        const weatherData =
          await weatherResponse.json();

        setWeather({
          city: location.name,
          country: location.country,
          temperature:
            weatherData.current_weather.temperature,
          windspeed:
            weatherData.current_weather.windspeed,
          time:
            weatherData.current_weather.time
        });

      } catch (error) {

        console.error(error);

        setError(
          "Error al obtener datos del clima"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="container">

      <div className="weather-card">

        <h1>🌦️ ClimaNova</h1>

        <p className="subtitle">
          Consulta el clima en tiempo real
        </p>

        <div className="search-box">

          <input
            type="text"
            placeholder="Ingresa una ciudad"
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
          />

          <button onClick={getWeather}>
            Buscar
          </button>

        </div>

        {loading && (
          <p className="loading">
            ⏳ Consultando clima...
          </p>
        )}

        {error && (
          <p className="error">
            ❌ {error}
          </p>
        )}

        {weather && (

          <div className="weather-info">

            <h2>
              📍 {weather.city},
              {" "}
              {weather.country}
            </h2>

            <div className="temp">
              {weather.temperature}°C
            </div>

            <div className="details">

              <p>
                💨 Viento:
                {" "}
                {weather.windspeed} km/h
              </p>

              <p>
                🕒 Actualizado:
                {" "}
                {weather.time}
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default App;