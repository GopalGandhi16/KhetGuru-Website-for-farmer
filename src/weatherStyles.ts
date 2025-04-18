// utils/weatherStyles.js

export default function getWeatherStyle (condition: string) {
    switch (condition.toLowerCase()) {
      case 'clear':
        return {
          bg: 'bg-gradient-to-br from-yellow-200 to-yellow-500',
          icon: '☀️',
          text: 'text-yellow-800'
        };
      case 'rain':
        return {
          bg: 'bg-gradient-to-br from-gray-500 to-blue-700',
          icon: '🌧️',
          text: 'text-blue-100'
        };
      case 'clouds':
        return {
          bg: 'bg-gradient-to-br from-gray-300 to-gray-500',
          icon: '☁️',
          text: 'text-gray-900'
        };
      case 'snow':
        return {
          bg: 'bg-gradient-to-br from-blue-100 to-white',
          icon: '❄️',
          text: 'text-blue-900'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-200 to-gray-400',
          icon: '🌤️',
          text: 'text-gray-800'
        };
    }
  };
  