export interface ThemeConfig {
  id: string;
  name: string;
  primaryColor: string; // Tailwind color class, e.g., 'text-[#00ffcc]'
  accentColor: string; // Tailwind bg-color class, e.g., 'bg-[#00ffcc]'
  borderColor: string; // Tailwind border-color class, e.g., 'border-[#00ffcc]/30'
  glowColor: string; // Shadow glow color, e.g., 'rgba(0, 255, 204, 0.4)'
  bgColor: string; // Tailwind dashboard bg, e.g., 'bg-slate-950'
  canvasStyle: 'stars' | 'grid' | 'glitch' | 'matrix' | 'neon_grid' | 'glassmorphic' | 'disruptive_dash';
}

export interface Alarm {
  id: string;
  time: string; // "HH:MM"
  label: string;
  enabled: boolean;
  repeat: boolean;
  triggered?: boolean;
}

export interface Reminder {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  time?: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  forecast: {
    day: string;
    temp: number;
    condition: string;
  }[];
}

export interface FinanceData {
  btcBrl: {
    price: number;
    change: number;
  };
  usdBrl: {
    price: number;
    change: number;
  };
}

export interface Track {
  id: string;
  name: string;
  duration?: string;
  fileData?: Blob; // Used for local file storage in IndexedDB
  isAmbient?: boolean;
  audioUrl?: string;
}
