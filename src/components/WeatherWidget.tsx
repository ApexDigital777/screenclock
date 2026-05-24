import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Sun, Cloud, CloudRain, CloudLightning, RefreshCw, Eye } from 'lucide-react';
import { ThemeConfig, WeatherData } from '../types';

interface WeatherWidgetProps {
  theme: ThemeConfig;
}

// Convert WMO Weather Codes to readable description & Lucide Icon
const getWeatherState = (code: number) => {
  if (code === 0) return { label: 'Céu Limpo', Icon: Sun };
  if ([1, 2, 3].includes(code)) return { label: 'Parcialmente Nublado', Icon: Cloud };
  if ([45, 48].includes(code)) return { label: 'Nevoeiro', Icon: Cloud };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Garoa', Icon: CloudRain };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Chuva', Icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Neve', Icon: Cloud };
  if ([95, 96, 99].includes(code)) return { label: 'Tempestade', Icon: CloudLightning };
  return { label: 'Instável', Icon: Cloud };
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [suggestions, setSuggestions] = useState<{ name: string; country: string; latitude: number; longitude: number; admin1?: string }[]>([]);

  // Default coordinate on first visit: Ciudad del Este (-25.5101, -54.6120)
  const defaultCity = {
    name: 'Ciudad del Este',
    lat: -25.5101,
    lon: -54.6120,
    country: 'Paraguai'
  };

  const fetchWeather = async (cityName: string, lat: number, lon: number, country: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao obter dados meteorológicos.');
      const data = await res.json();

      // Today's day names mapping for PT-BR
      const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const today = new Date();

      const forecastList = data.daily.time.slice(1, 4).map((timeStr: string, idx: number) => {
        const forecastDate = new Date(timeStr);
        // Force calculation of day name correctly
        const dayName = weekdays[forecastDate.getUTCDay()];
        const wmoCode = data.daily.weather_code[idx + 1];
        const state = getWeatherState(wmoCode);

        return {
          day: dayName,
          temp: Math.round((data.daily.temperature_2m_max[idx + 1] + data.daily.temperature_2m_min[idx + 1]) / 2),
          condition: state.label,
        };
      });

      const currentState = getWeatherState(data.current.weather_code);

      const parsedWeather: WeatherData = {
        city: `${cityName}, ${country}`,
        temperature: Math.round(data.current.temperature_2m),
        condition: currentState.label,
        humidity: Math.round(data.current.relative_humidity_2m),
        windSpeed: Math.round(data.current.wind_speed_10m),
        uvIndex: Math.round(data.daily.uv_index_max[0] || 0),
        forecast: forecastList,
      };

      setWeather(parsedWeather);
      // Persist set city
      localStorage.setItem('saved_weather_city', JSON.stringify({ name: cityName, lat, lon, country }));
    } catch (err: any) {
      setError(err?.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Search geocode hints
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=pt&format=json`;
        const res = await fetch(geocodeUrl);
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results);
        } else {
          setSuggestions([]);
        }
      } catch (e) {
        console.error('Geocoding search failed:', e);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    const cached = localStorage.getItem('saved_weather_city');
    if (cached) {
      try {
        const { name, lat, lon, country } = JSON.parse(cached);
        fetchWeather(name, lat, lon, country);
      } catch (e) {
        fetchWeather(defaultCity.name, defaultCity.lat, defaultCity.lon, defaultCity.country);
      }
    } else {
      fetchWeather(defaultCity.name, defaultCity.lat, defaultCity.lon, defaultCity.country);
    }
  }, []);

  const selectSuggestion = (s: any) => {
    const labelCity = s.name;
    const labelCountry = s.country || '';
    fetchWeather(labelCity, s.latitude, s.longitude, labelCountry);
    setSearchQuery('');
    setSuggestions([]);
  };

  // Resolve color
  let hexColor = '#00ffcc';
  if (theme.primaryColor.includes('#')) {
    const match = theme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
    if (match) hexColor = `#${match[1]}`;
  }

  const CurrentWeatherIcon = weather ? getWeatherState(weather.temperature > 30 ? 0 : 1).Icon : Cloud;

  return (
    <div
      id="weather-widget"
      className={`relative rounded-2xl border p-4 backdrop-blur-md bg-slate-950/45 ${theme.borderColor} flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.55)]`}
      style={{ boxShadow: `inset 0 0 15px ${hexColor}0D` }}
    >
      {/* Decorative scanning line top */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.accentColor} opacity-50 rounded-t-full glow-line`} />

      <div>
        {/* Header with Search */}
        <div className="flex items-center justify-between mb-3 relative z-20">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" style={{ color: hexColor }} />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Subsistema Clima</h3>
          </div>
          <button
            onClick={() => {
              if (weather) {
                const cached = localStorage.getItem('saved_weather_city');
                if (cached) {
                  const { name, lat, lon, country } = JSON.parse(cached);
                  fetchWeather(name, lat, lon, country);
                } else {
                  fetchWeather(defaultCity.name, defaultCity.lat, defaultCity.lon, defaultCity.country);
                }
              }
            }}
            disabled={loading}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search Input field */}
        <div className="relative mb-2.5 z-20">
          <div className="flex items-center rounded-lg bg-slate-950/60 border border-slate-800 focus-within:border-slate-600 px-2.5 py-1 transition-all">
            <Search className="w-3.5 h-3.5 text-slate-500 mr-2" />
            <input
              type="text"
              placeholder="Buscar cidade... (ex: Ciudad del Este)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 outline-none w-full placeholder-slate-500"
            />
          </div>

          {/* Suggetions layer */}
          {suggestions.length > 0 && (
            <ul className="absolute top-10 left-0 right-0 bg-slate-950/95 border border-slate-800 rounded-lg overflow-hidden z-30 shadow-2xl divide-y divide-slate-920/50">
              {suggestions.map((s, index) => (
                <li
                  key={index}
                  onClick={() => selectSuggestion(s)}
                  className="px-3 py-2 text-xs text-slate-300 hover:bg-slate-900/90 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <span className="truncate font-medium">{s.name}, {s.admin1 ? `${s.admin1}, ` : ''} <span className="text-slate-500 uppercase text-[10px]">{s.country}</span></span>
                  <span className="text-[9px] font-mono text-slate-500">[{s.latitude.toFixed(2)}, {s.longitude.toFixed(2)}]</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {loading && !weather ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className={`w-6 h-6 rounded-full border-2 border-t-transparent animate-spin`} style={{ borderColor: `${hexColor} transparent transparent transparent`, borderWidth: '2px' }} />
            <span className="text-slate-500 text-[10px] font-mono mt-2 uppercase tracking-wider">Lendo coordenadas...</span>
          </div>
        ) : error ? (
          <div className="text-center py-3">
            <span className="text-rose-500 text-[11px] font-mono block">{error}</span>
            <button
              onClick={() => fetchWeather(defaultCity.name, defaultCity.lat, defaultCity.lon, defaultCity.country)}
              className="text-[10px] underline text-slate-400 mt-2 block mx-auto cursor-pointer"
            >
              Restaurar Padrão
            </button>
          </div>
        ) : weather ? (
          <div className="flex flex-col">
            {/* Top info */}
            <div className="flex items-center justify-between py-1">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-mono tracking-wide truncate max-w-[150px]" title={weather.city}>
                  {weather.city.split(',')[0]}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{weather.city.split(',')[1] || ''}</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-950/50 border border-slate-800 text-slate-400">
                {weather.condition}
              </span>
            </div>

            {/* Middle temperature displays */}
            <div className="flex items-center gap-4 py-1.5 leading-none justify-between">
              <div className="flex items-baseline">
                <h2 className="text-3xl font-extrabold tracking-tighter text-slate-100 font-sans">
                  {weather.temperature}
                </h2>
                <span className="text-lg font-light text-slate-400 font-sans">°C</span>
              </div>
              <CurrentWeatherIcon className="w-10 h-10 stroke-[1.25]" style={{ color: hexColor }} />
            </div>

            {/* Diagnostic sensors detailed indexes */}
            <div className="grid grid-cols-3 gap-1.5 border-t border-b border-slate-800/50 py-2 my-2">
              <div className="flex flex-col items-center justify-center p-1 rounded bg-slate-950/30">
                <Wind className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                <span className="text-[8px] font-mono text-slate-500">VENTO</span>
                <span className="text-xs font-mono text-slate-300 font-bold mt-0.5">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1 rounded bg-slate-950/30">
                <Droplets className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                <span className="text-[8px] font-mono text-slate-500">UMIDADE</span>
                <span className="text-xs font-mono text-slate-300 font-bold mt-0.5">{weather.humidity}%</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1 rounded bg-slate-950/30">
                <Eye className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                <span className="text-[8px] font-mono text-slate-500">IND. UV</span>
                <span className="text-xs font-mono text-slate-300 font-bold mt-0.5">{weather.uvIndex} <span className="text-[8px] text-slate-500">UV</span></span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Forecast section */}
      {weather && (
        <div className="pt-1">
          <h4 className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1.5">Projeção de 3 Ciclos</h4>
          <div className="grid grid-cols-3 gap-1.5">
            {weather.forecast.map((fc, index) => {
              const forecastIcon = fc.condition.includes('Chuva')
                ? CloudRain
                : fc.condition.includes('Limp')
                ? Sun
                : Cloud;
              return (
                <div key={index} className="flex flex-col items-center p-1.5 rounded-lg bg-slate-950/40 border border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">{fc.day}</span>
                  <span className="text-[9px] font-mono text-slate-500 my-0.5 truncate max-w-full">{fc.condition}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {React.createElement(forecastIcon, { className: "w-3 h-3 text-slate-400" })}
                    <span className="text-xs font-mono text-slate-300 font-bold">{fc.temp}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
