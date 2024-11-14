export const getWeatherTheme = (condition: string) => {
  const normalizedDesc = condition.toLowerCase();
  
  switch (normalizedDesc) {
    case 'clear':
      return {
        bg: 'bg-gradient-to-br from-sky-400 to-blue-500',
        text: 'text-white',
        card: 'bg-white/20 backdrop-blur-lg',
      };
    case 'cloudy':
    case 'partly cloudy':
      return {
        bg: 'bg-gradient-to-br from-gray-400 to-slate-600',
        text: 'text-white',
        card: 'bg-white/20 backdrop-blur-lg',
      };
    case 'rain':
    case 'drizzle':
      return {
        bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
        text: 'text-white',
        card: 'bg-white/10 backdrop-blur-lg',
      };
    case 'thunderstorm':
      return {
        bg: 'bg-gradient-to-br from-zinc-700 to-zinc-900',
        text: 'text-white',
        card: 'bg-white/10 backdrop-blur-lg',
      };
    case 'snow':
      return {
        bg: 'bg-gradient-to-br from-blue-100 to-blue-300',
        text: 'text-gray-800',
        card: 'bg-white/30 backdrop-blur-lg',
      };
    case 'fog':
      return {
        bg: 'bg-gradient-to-br from-gray-300 to-gray-500',
        text: 'text-white',
        card: 'bg-white/20 backdrop-blur-lg',
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
        text: 'text-white',
        card: 'bg-white/20 backdrop-blur-lg',
      };
  }
};

// Convert WMO weather codes to more readable format
// Based on https://open-meteo.com/en/docs#weathervariables
export const getWeatherDescription = (code: number): { main: string; description: string; icon: string } => {
  const descriptions: { [key: number]: { main: string; description: string; icon: string } } = {
    0: { main: 'Clear', description: 'Clear sky', icon: '01d' },
    1: { main: 'Partly Cloudy', description: 'Mainly clear', icon: '02d' },
    2: { main: 'Partly Cloudy', description: 'Partly cloudy', icon: '03d' },
    3: { main: 'Cloudy', description: 'Overcast', icon: '04d' },
    45: { main: 'Fog', description: 'Foggy', icon: '50d' },
    48: { main: 'Fog', description: 'Depositing rime fog', icon: '50d' },
    51: { main: 'Drizzle', description: 'Light drizzle', icon: '09d' },
    53: { main: 'Drizzle', description: 'Moderate drizzle', icon: '09d' },
    55: { main: 'Drizzle', description: 'Dense drizzle', icon: '09d' },
    61: { main: 'Rain', description: 'Slight rain', icon: '10d' },
    63: { main: 'Rain', description: 'Moderate rain', icon: '10d' },
    65: { main: 'Rain', description: 'Heavy rain', icon: '10d' },
    71: { main: 'Snow', description: 'Slight snow fall', icon: '13d' },
    73: { main: 'Snow', description: 'Moderate snow fall', icon: '13d' },
    75: { main: 'Snow', description: 'Heavy snow fall', icon: '13d' },
    77: { main: 'Snow', description: 'Snow grains', icon: '13d' },
    80: { main: 'Rain', description: 'Slight rain showers', icon: '09d' },
    81: { main: 'Rain', description: 'Moderate rain showers', icon: '09d' },
    82: { main: 'Rain', description: 'Violent rain showers', icon: '09d' },
    85: { main: 'Snow', description: 'Slight snow showers', icon: '13d' },
    86: { main: 'Snow', description: 'Heavy snow showers', icon: '13d' },
    95: { main: 'Thunderstorm', description: 'Thunderstorm', icon: '11d' },
    96: { main: 'Thunderstorm', description: 'Thunderstorm with slight hail', icon: '11d' },
    99: { main: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: '11d' },
  };

  return descriptions[code] || descriptions[0];
};

export const processWeatherData = (data: any, location: GeocodingResult): WeatherData => {
  const weatherDesc = getWeatherDescription(data.current.weather_code);
  
  return {
    name: location.name,
    country: location.country,
    weather: weatherDesc,
    main: {
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      pressure: data.current.pressure_msl,
    },
    wind: {
      speed: data.current.wind_speed_10m,
    },
  };
};

export const getWeatherIcon = (code: string): string => {
  return `https://openweathermap.org/img/wn/${code}@4x.png`;
};