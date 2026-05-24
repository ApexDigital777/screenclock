import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  Settings, 
  Maximize2, 
  Minimize2, 
  ShieldAlert, 
  Activity, 
  Compass, 
  Radio, 
  Info, 
  Power,
  VolumeX,
  Volume2
} from 'lucide-react';

import { ThemeConfig, Alarm, Reminder } from './types';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { ThemeSelector, THEMES_LIST } from './components/ThemeSelector';
import { ClockWidget } from './components/ClockWidget';
import { AlarmWidget } from './components/AlarmWidget';
import { ReminderWidget } from './components/ReminderWidget';
import { WeatherWidget } from './components/WeatherWidget';
import { FinanceWidget } from './components/FinanceWidget';
import { YoutubeWidget } from './components/YoutubeWidget';
import { Mp3PlayerWidget } from './components/Mp3PlayerWidget';

export default function App() {
  // Theme settings
  const [theme, setTheme] = useState<ThemeConfig>(THEMES_LIST[0]);
  const [scanLines, setScanLines] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Widget States loaded/saved to localStorage
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Triggered alarm overlay display status
  const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);

  // Audio Context siren synthesis references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const alertIntervalRef = useRef<number | null>(null);

  // On mount: load alarms, reminders, and theme from localStorage
  useEffect(() => {
    const cachedTheme = localStorage.getItem('futur_saver_theme');
    if (cachedTheme) {
      try {
        setTheme(JSON.parse(cachedTheme));
      } catch (e) {
        console.error(e);
      }
    }

    const cachedAlarms = localStorage.getItem('futur_saver_alarms');
    if (cachedAlarms) {
      try {
        setAlarms(JSON.parse(cachedAlarms));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default alarms for user demo
      const defaults: Alarm[] = [
        { id: '1', time: '08:00', label: 'Ciclo Lunar / Boot', enabled: true, repeat: false },
        { id: '2', time: '14:30', label: 'Manutenção de Grade de Rede', enabled: false, repeat: false },
      ];
      setAlarms(defaults);
      localStorage.setItem('futur_saver_alarms', JSON.stringify(defaults));
    }

    const cachedReminders = localStorage.getItem('futur_saver_reminders');
    if (cachedReminders) {
      try {
        setReminders(JSON.parse(cachedReminders));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default reminders
      const defaults: Reminder[] = [
        { id: 'rem_1', text: 'Checar índice de UV em Ciudad del Este', priority: 'medium', completed: false },
        { id: 'rem_2', text: 'Atualizar carteira de BTC para nó principal', priority: 'high', completed: false },
        { id: 'rem_3', text: 'Injetar novos logs de rede no protetor de tela', priority: 'low', completed: true },
      ];
      setReminders(defaults);
      localStorage.setItem('futur_saver_reminders', JSON.stringify(defaults));
    }
  }, []);

  // Sync / Monitor alarms every minute matching
  useEffect(() => {
    const checker = setInterval(() => {
      const now = new Date();
      const currentHHMM = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // Look for active enabled alerts matching current time
      const match = alarms.find((a) => a.enabled && a.time === currentHHMM);
      if (match && !triggeredAlarm) {
        triggerEmergencyOverlay(match);
      }
    }, 15000); // Check every 15s

    return () => clearInterval(checker);
  }, [alarms, triggeredAlarm]);

  // Procedural futuristic red alert synthesizer siren
  const triggerEmergencyOverlay = (alarm: Alarm) => {
    setTriggeredAlarm(alarm);

    try {
      // Lazy init AudioContext
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Synthesize emergency oscillators
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sawtooth';
      
      // Cyber futuristic modulate wave loop
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;

      // Frequency wobble loop
      let upwards = true;
      alertIntervalRef.current = window.setInterval(() => {
        const now = ctx.currentTime;
        if (upwards) {
          osc.frequency.linearRampToValueAtTime(950, now + 0.35);
        } else {
          osc.frequency.linearRampToValueAtTime(450, now + 0.35);
        }
        upwards = !upwards;
      }, 400);

    } catch (err) {
      console.warn('Audio Synthesis could not start automatically due to gesture requirements.', err);
    }
  };

  const dismissEmergency = () => {
    // Clear audio elements
    if (alertIntervalRef.current) {
      clearInterval(alertIntervalRef.current);
      alertIntervalRef.current = null;
    }

    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch (e) {}
      oscRef.current = null;
    }

    if (triggeredAlarm) {
      // Disable alarm so it doesn't trigger repeatedly
      const updated = alarms.map((a) => {
        if (a.id === triggeredAlarm.id) {
          return { ...a, enabled: false };
        }
        return a;
      });
      setAlarms(updated);
      localStorage.setItem('futur_saver_alarms', JSON.stringify(updated));
    }

    setTriggeredAlarm(null);
  };

  // Select theme helper
  const handleThemeChange = (newTheme: ThemeConfig) => {
    setTheme(newTheme);
    localStorage.setItem('futur_saver_theme', JSON.stringify(newTheme));
  };

  // Fullscreen trigger natively within container frame (or visual toggle simulation)
  const toggleFullscreen = () => {
    const parentContainer = document.getElementById('root');
    if (!parentContainer) return;

    if (!document.fullscreenElement) {
      parentContainer.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => {
          // Standard simulation if browser blocked within iframe sandbox
          setIsFullscreen(!isFullscreen);
        });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen to escape coordinate keys for simulation exit
  useEffect(() => {
    const handleExit = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleExit);
    return () => document.removeEventListener('fullscreenchange', handleExit);
  }, []);

  // Derive dynamic color styling coordinates
  let hexColor = '#00ffcc';
  if (theme.primaryColor.includes('#')) {
    const match = theme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
    if (match) hexColor = `#${match[1]}`;
  }

  return (
    <div className={`relative min-h-screen font-sans select-none overflow-x-hidden ${theme.bgColor} text-slate-200 transition-colors duration-500`}>
      
      {/* Dynamic Background Custom Canvas */}
      <BackgroundCanvas theme={theme} />

      {/* CRT Scanline effect simulation overlay */}
      {scanLines && (
        <div className="absolute inset-0 scanlines-overlay pointer-events-none z-10 opacity-30" />
      )}

      {/* Futuristic Emergency Sirens / Alarms overlay */}
      {triggeredAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md emergency-strobe animate-fadeIn">
          <div className="w-full max-w-md p-8 rounded-2xl border-2 border-rose-500 bg-slate-950/95 text-center shadow-[0_0_50px_rgba(239,68,68,0.5)]">
            <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold font-mono tracking-wider text-rose-400 uppercase mb-2">Subsistema Alerta Crítico</h2>
            <p className="text-[11px] font-mono text-rose-500 uppercase tracking-widest mb-6">Detecção de Coincidência Temporal</p>

            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 mb-6 font-mono text-center">
              <span className="text-4xl font-extrabold text-slate-100 block tracking-tight">{triggeredAlarm.time}</span>
              <span className="text-sm font-semibold text-slate-300 block mt-2">{triggeredAlarm.label || 'Sem Rótulo'}</span>
            </div>

            <button
              onClick={dismissEmergency}
              className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-slate-900 font-bold font-mono text-xs uppercase rounded-lg tracking-widest transition-all cursor-pointer shadow-lg outline-none flex items-center justify-center gap-2"
            >
              <VolumeX className="w-4 h-4 text-slate-950" /> Confirmar e Interromper Sinal
            </button>
          </div>
        </div>
      )}

      {/* Main interactive cockpit dashboard grid */}
      <main className="relative z-20 max-w-[1450px] mx-auto p-2 sm:p-3">
        
        {/* If user toggled screensaver focus mode, render dedicated immersive screensaver view to prevent burn in */}
        {isFocusMode ? (
          <div className="flex flex-col items-center justify-center min-h-[78vh] animate-fadeIn relative">
            <div className="w-full max-w-2xl relative">
              <ClockWidget 
                theme={theme} 
                alarms={alarms} 
                isFocusMode={isFocusMode} 
                setIsFocusMode={setIsFocusMode} 
              />
            </div>

            {/* Immersive navigation footer */}
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-between items-center px-4 py-2 bg-slate-950/20 backdrop-blur-md rounded-lg border border-slate-900/55 max-w-lg mx-auto text-[10px] font-mono text-slate-500 animate-pulse">
              <span>SISTEMA IMERSIVO ATIVO</span>
              <span>PREVENTOR DE MARCAS OLED</span>
              <button 
                onClick={() => setIsFocusMode(false)}
                className="text-white uppercase font-bold hover:underline cursor-pointer"
                style={{ color: hexColor }}
              >
                RESTABELECER CONSOLE [ESC]
              </button>
            </div>
          </div>
        ) : (
          /* Normal Dashboard view: showing all widgets neatly structured */
          <div className="space-y-2.5">
            
            {/* Minimal High-Tech HUD Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-900/70 pb-2 mb-1">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center w-6 h-6 rounded bg-slate-950 border border-slate-900">
                  <Activity className="w-3.5 h-3.5 animate-pulse" style={{ color: hexColor }} />
                  <div className="absolute inset-0 rounded animate-ping opacity-10" style={{ backgroundColor: hexColor }} />
                </div>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                    Terminal HUD Saver
                  </h1>
                  <span className="text-[9px] text-emerald-400 font-mono font-medium px-1.5 py-0.5 bg-emerald-950/40 border border-emerald-900/40 rounded uppercase leading-none">
                    ATIVO
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-3 mr-2 text-[9px] font-mono text-slate-505 uppercase">
                  <span>FPS: 60/60</span>
                  <span>|</span>
                  <span>SINAL: SEGURO</span>
                </div>
                
                <button
                  onClick={() => setIsFocusMode(true)}
                  className="px-2.5 py-1 rounded bg-slate-950/60 hover:bg-slate-900/80 hover:text-white text-slate-400 font-mono text-[10px] uppercase border border-slate-900 transition-all cursor-pointer"
                  title="Modo Screensaver para TV ou Monitores OLED"
                >
                  Preventor OLED
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="px-2.5 py-1 rounded bg-slate-950/60 hover:bg-slate-900/80 hover:text-white text-slate-400 font-mono text-[10px] uppercase border border-slate-900 transition-all cursor-pointer"
                >
                  {isFullscreen ? 'Sair Cheia' : 'Tela Cheia'}
                </button>
              </div>
            </div>

            {/* Compact 4-Column Bento Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              
              {/* Col 1: System Master Clock & appearance setting console */}
              <div className="space-y-2.5 flex flex-col justify-between">
                <ClockWidget 
                  theme={theme} 
                  alarms={alarms} 
                  isFocusMode={isFocusMode} 
                  setIsFocusMode={setIsFocusMode} 
                />
              </div>

              {/* Col 2: South America real-time climate and pricing indicators */}
              <div className="space-y-2.5 flex flex-col justify-between">
                <WeatherWidget theme={theme} />
                <FinanceWidget theme={theme} />
              </div>

              {/* Col 3: Media Entertainment (Youtube Video Stream & Playlist MP3 Engine) */}
              <div className="space-y-2.5 flex flex-col justify-between">
                <YoutubeWidget theme={theme} />
                <Mp3PlayerWidget theme={theme} />
              </div>

              {/* Col 4: Operations workflow (Futuristic alerts list & task boards) */}
              <div className="space-y-2.5 flex flex-col justify-between">
                <AlarmWidget theme={theme} alarms={alarms} setAlarms={setAlarms} />
                <ReminderWidget theme={theme} reminders={reminders} setReminders={setReminders} />
              </div>

            </div>

          </div>
        )}
      </main>

      {/* Minimalistic HUD bottom footer */}
      {!isFocusMode && (
        <footer className="relative z-20 border-t border-slate-900/70 bg-slate-950/30 py-2.5 px-6 text-center text-xs font-mono text-slate-505 select-none flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1380px] mx-auto mt-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Compass className="w-3.5 h-3.5" style={{ color: hexColor }} />
            <span>SISTEMA DE PROTEÇÃO EM TELA CHEIA PT-BR</span>
          </div>
          <span>Células de grade e osciladores sintetizados em sandbox nativo © 2026</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase text-[9px] text-slate-400">SAÚDE CONSOLE: OK</span>
          </div>
        </footer>
      )}
      {/* Floating Theme Customizer and HUD Settings Trigger */}
      <ThemeSelector 
        currentTheme={theme} 
        onThemeSelect={handleThemeChange} 
        scanLines={scanLines}
        setScanLines={setScanLines}
        gridSpeed="slow"
        setGridSpeed={() => {}}
      />
    </div>
  );
}
