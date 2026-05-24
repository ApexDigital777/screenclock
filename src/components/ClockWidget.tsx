import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Zap, Maximize2, Minimize2 } from 'lucide-react';
import { ThemeConfig, Alarm } from '../types';

interface ClockWidgetProps {
  theme: ThemeConfig;
  alarms: Alarm[];
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({
  theme,
  alarms,
  isFocusMode,
  setIsFocusMode,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 100); // Higher refresh rate to allow seamless matching
    return () => clearInterval(interval);
  }, []);

  const formatHours = (date: Date) => {
    return date.getHours().toString().padStart(2, '0');
  };

  const formatMinutes = (date: Date) => {
    return date.getMinutes().toString().padStart(2, '0');
  };

  const formatSeconds = (date: Date) => {
    return date.getSeconds().toString().padStart(2, '0');
  };

  const formatMilliseconds = (date: Date) => {
    return Math.floor(date.getMilliseconds() / 10).toString().padStart(2, '0');
  };

  const formattedDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('pt-BR', options);
  };

  // Find next enabled alarm
  const nextAlarm = alarms
    .filter((a) => a.enabled)
    .sort((a, b) => {
      return a.time.localeCompare(b.time);
    })[0];

  // Accent color mapping
  let hexColor = '#00ffcc';
  if (theme.primaryColor.includes('#')) {
    const match = theme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
    if (match) hexColor = `#${match[1]}`;
  }

  return (
    <div
      id="clock-widget"
      className={`relative rounded-2xl border p-4 flex flex-col justify-between h-full bg-slate-950/45 backdrop-blur-md transition-all duration-300 ${
        isFocusMode
          ? 'col-span-full md:row-span-2 border-slate-705/60 p-10 min-h-[300px]'
          : `${theme.borderColor} hover:shadow-[0_0_20px_rgba(0,0,0,0.55)]`
      }`}
      style={{ boxShadow: `inset 0 0 15px ${hexColor}0D` }}
    >
      {/* Visual scanning line top */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.accentColor} opacity-50 rounded-t-full glow-line`} />

      {/* Control HUD elements */}
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: hexColor }} />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Cronômetro Principal</span>
        </div>

        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          className="text-slate-500 hover:text-white transition-colors p-1 rounded border border-transparent hover:border-slate-800 bg-slate-950/20 cursor-pointer"
          title={isFocusMode ? 'Miniaturizar visualização' : 'Maximizar relógio para Protetor de Tela'}
        >
          {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main clock layout */}
      <div className="text-center my-auto py-2">
        <div className="flex items-center justify-center font-bold tracking-tight text-white select-none gap-1 sm:gap-2 leading-none">
          {/* Hour block */}
          <div className="flex flex-col items-center">
            <span className={`${isFocusMode ? 'text-7xl sm:text-8xl md:text-9xl' : 'text-4xl sm:text-5xl md:text-6xl'} font-extrabold tracking-tighter text-slate-100 font-sans`}>
              {formatHours(time)}
            </span>
            <span className="text-[9px] font-mono text-slate-500 tracking-widest mt-1">HORA</span>
          </div>

          {/* Separator */}
          <span className={`${isFocusMode ? 'text-6xl md:text-8xl' : 'text-3xl md:text-5xl'} text-slate-500 font-extralight animate-pulse mb-4`}>:</span>

          {/* Minute block */}
          <div className="flex flex-col items-center">
            <span className={`${isFocusMode ? 'text-7xl sm:text-8xl md:text-9xl' : 'text-4xl sm:text-5xl md:text-6xl'} font-extrabold tracking-tighter text-slate-100 font-sans`}>
              {formatMinutes(time)}
            </span>
            <span className="text-[9px] font-mono text-slate-500 tracking-widest mt-1">MINUTO</span>
          </div>

          {/* Separator */}
          <span className={`${isFocusMode ? 'text-6xl md:text-8xl' : 'text-3xl md:text-5xl'} text-slate-500 font-extralight animate-pulse mb-4`}>:</span>

          {/* Second block */}
          <div className="flex flex-col items-center">
            <span className={`${isFocusMode ? 'text-7xl sm:text-8xl md:text-9xl' : 'text-4xl sm:text-5xl md:text-6xl'} font-semibold text-slate-200 font-sans`}>
              {formatSeconds(time)}
            </span>
            <span className="text-[9px] font-mono text-slate-505 tracking-widest mt-1">SEGUNDO</span>
          </div>
        </div>

        {/* Date line */}
        <span className="block mt-4 text-xs text-slate-300 font-mono capitalize tracking-wide">
          {formattedDate(time)}
        </span>
      </div>

      {/* Footer information HUD */}
      <div className="pt-4 border-t border-slate-800/40 mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono text-slate-400 z-10">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>FREQ: 10HZ</span>
          <span className="text-slate-600">|</span>
          <span>SINCRONIZAÇÃO NATIVA</span>
        </div>

        {nextAlarm ? (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-950/20 border border-rose-900/30 text-rose-400 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>ALARM PROB: {nextAlarm.time} - {nextAlarm.label || 'Sem Rótulo'}</span>
          </div>
        ) : (
          <div className="text-slate-500 text-[11px]">NENHUM ALARME PRONTO</div>
        )}
      </div>
    </div>
  );
};
