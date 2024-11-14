export interface WeatherData {
  name: string;
  country: string;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
}

export interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}