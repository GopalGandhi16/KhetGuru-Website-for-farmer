export interface WeatherData {
  cod: string;
  message?: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface ForecastData {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    icon: string;
  }>;
}

export interface DailyForecast {
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
  fullData: ForecastData[];
}

export interface Content {
  title: string;
  subtitle: string;
  tagline: string;
  upload: string;
  howItWorks: string;
  step1: string;
  step2: string;
  step3: string;
  testimonials: string;
  contact: string;
  help: string;
}

export interface ContentMap {
  en: Content;
  hi: Content;
}
