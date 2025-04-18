import React, { useState } from 'react';
import { Upload, Camera, Leaf, Languages, Phone, HelpCircle, Sun, Sprout, Cloud, Search } from 'lucide-react';
import axios from "axios";
import getWeatherStyle from './weatherStyles';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [UserInput, setUserInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [dailyForecast, setDailyForecast] = useState<any>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  
  const apiKey = 'dd7fb77e8f8964a1b93a706972f721a3';

  const getWeather = async () => {
    if (!city) {
      alert('Please enter a city');
      return;
    }

    try {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl),
      ]);

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      if (weatherData.cod === '404') {
        alert(weatherData.message);
        return;
      }

      setWeather(weatherData);
      setForecast(forecastData.list);
      groupForecastByDay(forecastData.list);

    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Error fetching data. Please try again.');
    }
  };

  const groupForecastByDay = (forecastData: any[]) => {
    const grouped: any = {};

    forecastData.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });

      if (!grouped[day]) {
        grouped[day] = {
          minTemp: Math.round(item.main.temp_min - 273.15),
          maxTemp: Math.round(item.main.temp_max - 273.15),
          icon: item.weather[0].icon,
          description: item.weather[0].main,
          fullData: [],
        };
      }

      grouped[day].minTemp = Math.min(grouped[day].minTemp, Math.round(item.main.temp_min - 273.15));
      grouped[day].maxTemp = Math.max(grouped[day].maxTemp, Math.round(item.main.temp_max - 273.15));
      grouped[day].fullData.push(item);
    });

    setDailyForecast(grouped);
  };

  const handleBack = () => {
    setSelectedDay(null);
  };

  const content = {
    en: {
      title: 'Krishi Mitra',
      subtitle: 'Empowering Farmers with Technology',
      tagline: 'Combat Crop Diseases with AI',
      upload: 'Upload Image',
      howItWorks: 'How it Works',
      step1: 'Click Photo',
      step2: 'Upload',
      step3: 'Get Diagnosis',
      testimonials: 'Farmer Testimonials',
      contact: 'Contact Us',
      help: 'Get Help',
    },
    hi: {
      title: 'कृषि मित्र',
      subtitle: 'किसानों को प्रौद्योगिकी से सशक्त बनाना',
      tagline: 'AI के साथ फसल रोगों का मुकाबला करें',
      upload: 'छवि अपलोड करें',
      howItWorks: 'यह कैसे काम करता है',
      step1: 'फोटो क्लिक करें',
      step2: 'अपलोड करें',
      step3: 'निदान प्राप्त करें',
      testimonials: 'किसान प्रशंसापत्र',
      contact: 'संपर्क करें',
      help: 'मदद प्राप्त करें',
    },
  };

  const t = content[language];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  async function GenerateAnswers() {
    try {
      console.log("Loading...");
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBZ3FFGE3rpZStTfnFixK3VWAqgjyCpx9g",
        {
          contents: [
            {
              parts: [
                {
                  text: UserInput,
                },
              ],
            },
          ],
        }
      );
      
      const generatedText: string =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response received.";
      
      setAnswer(generatedText);
    } catch (error) {
      console.error("Error generating content:", error);
      setAnswer("Failed to generate response.");
    }
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      <div className="bg-white bg-opacity-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2e7d32] to-[#388e3c] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <Sprout className="h-8 w-8 text-[#2e7d32]" />
            </div>
          <h1 className="text-3xl font-bold font-serif">Krishi.Mitra</h1>
          <p className="text-lg italic">From soil To success - Together!</p>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ffffff30] hover:bg-[#ffffff40] transition-colors border border-[#ffffff50]">
            <Languages className="h-5 w-5" />
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
      </header>
      {/* Main Content Layout */}
      <div className="container mx-auto px-4 py-8">
        {/* Upload Section - Top */}
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-nature-200 mb-8">
          <h2 className="text-4xl font-bold text-nature-800 mb-6 text-center">{t.subtitle}</h2>
          <p className="text-xl text-nature-600 mb-8 text-center">{t.tagline}</p>
          
          <label className="flex flex-col items-center gap-6 cursor-pointer">
            <div className="w-40 h-40 bg-gradient-to-b from-nature-300 to-nature-500 rounded-full flex items-center justify-center border-4 border-nature-400 shadow-inner relative overflow-hidden">
              {selectedImage ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <>
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png" 
                    alt="Camera Icon"
                    className="w-20 h-20 z-10"
                  />
                  <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/hand-painted-watercolor-leaf-texture_23-2149630970.jpg')] opacity-30"></div>
                </>
              )}
            </div>
            <span className="text-white text-xl font-semibold bg-[#2e7d32] px-6 py-3 rounded-full hover:bg-[#1b5e20] transition-colors shadow-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <span className="font-bold">Upload Image</span>
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Main Content Layout */}
        <section className="diagnosis"></section>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Diagnosis */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl border border-nature-200 relative overflow-hidden min-w-[300px]">
            <img 
              src="https://images.unsplash.com/photo-1530035587381-cf3bfb5b5a6a?w=400&h=300&fit=crop" 
              alt="Agriculture background"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative">
            <h3 className="text-2xl font-bold text-nature-800 mb-6 text-center">
              {language === 'en' ? 'Crop Diagnosis' : 'फसल निदान'}
            </h3>
            <div className="flex flex-col gap-4">
              <input 
                type="text"
                placeholder={language === 'en' ? 'Describe your crop issue...' : 'अपनी फसल की समस्या लिखें...'}
                value={UserInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-nature-300 focus:outline-none focus:ring-2 focus:ring-nature-400 text-nature-800 placeholder-nature-400"
              />
              <button 
                onClick={GenerateAnswers}
                className="bg-[#2e7d32] text-white px-6 py-3 rounded-xl hover:bg-[#1b5e20] transition-colors shadow-lg font-bold text-lg flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                {language === 'en' ? 'Search Diagnosis' : 'निदान खोजें'}
              </button>
              {answer && (
                <div className="mt-6 bg-nature-50 border border-nature-200 p-4 rounded-xl text-nature-800 shadow-inner whitespace-pre-wrap">
                  {answer}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Weather (aligned below upload) */}
          <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl border border-nature-200 relative overflow-hidden min-w-[300px]">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-nature-200 relative overflow-hidden min-w-[300px]">
            <img 
              src="https://images.unsplash.com/photo-1601134467661-3d775b99c7b8?w=400&h=300&fit=crop" 
              alt="Weather background"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative">
            <h3 className="text-2xl font-bold text-nature-800 mb-6 text-center">
              {language === 'en' ? 'Weather Forecast' : 'मौसम पूर्वानुमान'}
            </h3>
            <div className="flex gap-4 items-center justify-center">
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="px-4 py-3 rounded-xl border border-nature-300 focus:outline-none focus:ring-2 focus:ring-nature-400 text-nature-800"
              />
              <button
                onClick={getWeather}
                className="bg-[#2e7d32] text-white px-6 py-3 rounded-xl hover:bg-[#1b5e20] transition-colors shadow-lg font-bold text-lg flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                {language === 'en' ? 'Search Weather' : 'मौसम खोजें'}
              </button>
            </div>

            {weather && (
              <div className="mt-6 p-4 rounded-xl bg-nature-50 border border-nature-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold text-nature-800">{weather.name}</h4>
                  <p className="text-lg font-bold text-nature-700">
                    {Math.round(weather.main.temp - 273.15)}°C
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-lg ${getWeatherStyle(weather.weather[0].main).text}`}>
                    {getWeatherStyle(weather.weather[0].main).icon} {weather.weather[0].description}
                  </span>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="mx-auto mt-4"
                />
              </div>
            )}

            <div className="mt-6">
              {selectedDay ? (
                <>
                  <button 
                    onClick={handleBack}
                    className="text-nature-600 hover:text-nature-800 mb-4 flex items-center gap-1"
                  >
                    ← Back to forecast
                  </button>
                  <h4 className="text-xl font-semibold text-nature-800 mb-4">
                    Hourly Forecast for {selectedDay}
                  </h4>
                  <div className="space-y-4">
                    {dailyForecast[selectedDay]?.fullData.map((item: any, idx: number) => {
                      const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const temp = Math.round(item.main.temp - 273.15);
                      const feelsLike = Math.round(item.main.feels_like - 273.15);
                      const humidity = item.main.humidity;
                      const windSpeed = (item.wind.speed * 3.6).toFixed(1);

                      return (
                        <div key={idx} className="p-3 rounded-lg bg-nature-50 border border-nature-200">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-nature-800">{time}</p>
                            <div className="flex items-center gap-2">
                              <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="" />
                              <p className="font-bold text-nature-700">{temp}°C</p>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-nature-600">
                            <p>Feels like: {feelsLike}°C</p>
                            <p>Humidity: {humidity}%</p>
                            <p>Wind: {windSpeed} km/h</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                  {Object.entries(dailyForecast).slice(0, 7).map(([day, data]: any) => (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className="cursor-pointer p-3 rounded-lg bg-nature-50 border border-nature-200 hover:bg-nature-100 transition-colors text-center"
                    >
                      <p className="font-semibold text-nature-800">{day}</p>
                      <img 
                        src={`https://openweathermap.org/img/wn/${data.icon}.png`} 
                        alt={data.description} 
                        className="mx-auto my-1" 
                      />
                      <p className="text-sm text-nature-700">
                        {data.minTemp}°C / {data.maxTemp}°C
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>

    {/* How it Works */}
      <section className="bg-[#2e7d32] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x1080?farm+field')] opacity-20 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center text-white mb-12">{t.howItWorks}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Camera, text: t.step1 },
              { icon: Upload, text: t.step2 },
              { icon: Leaf, text: t.step3 },
            ].map((step, index) => (
              <div key={index} className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <step.icon className="w-10 h-10 text-[#2e7d32]" />
                </div>
                <p className="font-semibold text-white text-xl">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-[#1b5e20] mb-12">{t.testimonials}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-[#4caf5020]">
              <div className="relative mb-6">
                <img
                  src={
                    i === 1
                      ? 'https://images.nationalgeographic.org/image/upload/v1638892233/EducationHub/photos/crops-growing-in-thailand.jpg'
                      : i === 2
                      ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF2nS_xyHIvwLGCLbLStaS9kOS3q46lTza_Ur7BJH_DEDPy7W81XaeuAsNvS7hPfDr8G4&usqp=CAU'
                      : 'data:image/jpeg;base64,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'
                  }
                  alt="Farmer"
                  className="w-48 h-48 rounded-full mx-auto border-4 border-[#a5d6a7] object-cover shadow-xl hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-0 right-1/3 bg-[#4caf50] text-white p-2 rounded-full">
                  <Sun className="w-6 h-6" />
                </div>
              </div>
              <p className="text-[#2e7d32] text-center text-lg leading-relaxed">
                "Krishi Mitra helped me identify and treat crop diseases before they spread. It saved my harvest!"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Help */}
      <section className="relative text-white py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
              <Phone className="w-16 h-16 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-6">{t.contact}</h3>
              <p className="text-xl mb-2">1800-KRISHI-MITRA</p>
              <p className="text-xl">support@krishimitra.com</p>
            </div>
            <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
              <HelpCircle className="w-16 h-16 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-6">{t.help}</h3>
              <p className="text-xl mb-2">24/7 Support Available</p>
              <p className="text-xl">Local Language Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1b5e20] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-2xl font-bold mb-6">Resources</h4>
              <ul className="space-y-4">
                <li className="hover:text-[#81c784] transition-colors cursor-pointer">Crop Disease Database</li>
                <li className="hover:text-[#81c784] transition-colors cursor-pointer">Prevention Guide</li>
                <li className="hover:text-[#81c784] transition-colors cursor-pointer">Best Practices</li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-6">Team</h4>
              <ul className="space-y-4">
                <li className="hover:text-[#81c784] transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-[#81c784] transition-colors cursor-pointer">Our Mission</li>
                <li className="hover:text-[#81c784] transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-6">Connect</h4>
              <ul className="space-y-4">
                <li className="hover:text-[#81c784] transition-colors cursor-pointer">Facebook</li>
                <li className="hover:text-[#81c784] transition-colors cursor-pointer">WhatsApp</li>
                <li className="hover:text-[#81c784] transition-colors cursor-pointer">YouTube</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-12 pt-12 border-t border-white border-opacity-20">
            <p className="text-[#81c784]">&copy; 2025 Krishi Mitra. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;
