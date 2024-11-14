import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { SearchBar } from './components/SearchBar';
import { WeatherData, GeocodingResult } from './types';
import { getWeatherTheme, processWeatherData } from './utils';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWeatherData = async (query: string) => {
    try {
      setLoading(true);
      setError('');
      
      // First, get coordinates using geocoding
      const geocodingResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      );
      const geocodingData = await geocodingResponse.json();
      
      if (!geocodingData.results?.length) {
        throw new Error('Location not found. Please try a different search term.');
      }

      const location: GeocodingResult = geocodingData.results[0];
      
      // Then fetch weather data using coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,weather_code,wind_speed_10m&timezone=auto`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data. Please try again.');
      }
      
      const weatherResult = await weatherResponse.json();
      const processedData = processWeatherData(weatherResult, location);
      setWeatherData(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError('');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Get location name from coordinates
          const reverseGeocodingResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
          );
          const reverseGeocodingData = await reverseGeocodingResponse.json();
          
          if (!reverseGeocodingData.results?.length) {
            throw new Error('Could not determine your location. Please try searching for a city instead.');
          }
          
          fetchWeatherData(reverseGeocodingData.results[0].name);
        },
        (err) => {
          setError('Please enable location access or search for a city');
          setLoading(false);
        },
        { timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const theme = weatherData 
    ? getWeatherTheme(weatherData.weather.main)
    : getWeatherTheme('clear');

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <button
          onClick={getUserLocation}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors"
        >
          <MapPin className="w-5 h-5" />
          Use my location
        </button>

        <SearchBar onSearch={fetchWeatherData} />

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-4 text-white max-w-md w-full text-center">
            {error}
          </div>
        )}

        {!loading && !error && weatherData && <WeatherCard data={weatherData} />}
      </div>
    </div>
  );
}

export default App;