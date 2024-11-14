import React from 'react';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { WeatherData } from '../types';
import { getWeatherTheme, getWeatherIcon } from '../utils';

interface WeatherCardProps {
  data: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const theme = getWeatherTheme(data.weather.main);

  return (
    <div className={`${theme.card} rounded-3xl p-8 w-full max-w-md shadow-2xl ${theme.text}`}>
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2">
          {data.name}, {data.country}
        </h2>
        <img
          src={getWeatherIcon(data.weather.icon)}
          alt={data.weather.description}
          className="w-32 h-32 object-contain"
        />
        <p className="text-5xl font-bold mb-4">{Math.round(data.main.temp)}°C</p>
        <p className="text-xl capitalize mb-6">{data.weather.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5" />
          <span>Feels like: {Math.round(data.main.feels_like)}°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5" />
          <span>Wind: {Math.round(data.wind.speed * 3.6)} km/h</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5" />
          <span>Humidity: {data.main.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          <span>Pressure: {Math.round(data.main.pressure)} hPa</span>
        </div>
      </div>
    </div>
  );
};