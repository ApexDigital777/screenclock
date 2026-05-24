import React from 'react';
import { Palette, Eye, ShieldAlert, Sliders, EyeOff, X, Layout, Box, BarChart2, Sun, DollarSign, Activity, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ThemeConfig } from '../types';

interface ThemeSelectorProps {
  currentTheme: ThemeConfig;
  onThemeSelect: (theme: ThemeConfig) => void;
  scanLines: boolean;
  setScanLines: (val: boolean) => void;
  gridSpeed: 'slow' | 'medium' | 'fast';
  setGridSpeed: (val: 'slow' | 'medium' | 'fast') => void;
}

export const THEMES_LIST: ThemeConfig[] = [
  {
    id: 'neon_grid_var1',
    name: 'Variação 01 - Neon Grid (Cyberpunk)',
    primaryColor: 'text-[#00ffcc]',
    accentColor: 'bg-[#d946ef]',
    borderColor: 'border-[#00ffcc]/40 ring-1 ring-[#d946ef]/20 shadow-[0_0_15px_rgba(217,70,239,0.1)]',
    glowColor: 'rgba(0, 255, 204, 0.25)',
    bgColor: 'bg-[#03010c]',
    canvasStyle: 'neon_grid',
  },
  {
    id: 'glassmorphic_var2',
    name: 'Variação 02 - Glassmorphic Flow',
    primaryColor: 'text-[#38bdf8]',
    accentColor: 'bg-[#00e1ff]',
    borderColor: 'border-white/10 bg-slate-900/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl',
    glowColor: 'rgba(56, 189, 248, 0.2)',
    bgColor: 'bg-[#0a1120]',
    canvasStyle: 'glassmorphic',
  },
  {
    id: 'disruptive_dash_var3',
    name: 'Variação 03 - Disruptive Dash',
    primaryColor: 'text-[#eab308]',
    accentColor: 'bg-[#eab308]',
    borderColor: 'border-2 border-[#eab308]/55 rounded-none shadow-[3px_3px_0_0_#eab308]',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    bgColor: 'bg-[#000000]',
    canvasStyle: 'disruptive_dash',
  },
  {
    id: 'monochrome_stealth',
    name: 'Stark Off-White (Preto/Branco Minimal)',
    primaryColor: 'text-[#ffffff]',
    accentColor: 'bg-[#ffffff]',
    borderColor: 'border-zinc-800',
    glowColor: 'rgba(255, 255, 255, 0.18)',
    bgColor: 'bg-[#000000]',
    canvasStyle: 'stars',
  },
  {
    id: 'matrix_hacker',
    name: 'Verde Console (Preto/Verde Stark)',
    primaryColor: 'text-[#22c55e]',
    accentColor: 'bg-[#22c55e]',
    borderColor: 'border-emerald-950',
    glowColor: 'rgba(34, 197, 94, 0.16)',
    bgColor: 'bg-[#000000]',
    canvasStyle: 'matrix',
  },
  {
    id: 'tokyo_neon',
    name: 'Fúcsia Tóquio (Neon Cyber)',
    primaryColor: 'text-[#f43f5e]',
    accentColor: 'bg-[#f43f5e]',
    borderColor: 'border-rose-950',
    glowColor: 'rgba(244, 63, 94, 0.18)',
    bgColor: 'bg-[#020204]',
    canvasStyle: 'stars',
  },
  {
    id: 'amoled_gold',
    name: 'AMOLED Dourado (Gold/Preto)',
    primaryColor: 'text-[#eab308]',
    accentColor: 'bg-[#eab308]',
    borderColor: 'border-zinc-900',
    glowColor: 'rgba(234, 179, 8, 0.15)',
    bgColor: 'bg-[#000000]',
    canvasStyle: 'grid',
  },
  {
    id: 'nord_frost',
    name: 'Nord Frost (Prata & Azul Gelo)',
    primaryColor: 'text-[#38bdf8]',
    accentColor: 'bg-[#0284c7]',
    borderColor: 'border-sky-950',
    glowColor: 'rgba(56, 189, 248, 0.15)',
    bgColor: 'bg-[#030712]',
    canvasStyle: 'stars',
  },
  {
    id: 'sleek_interface',
    name: 'Interface Sleek (Ciano Fino)',
    primaryColor: 'text-[#22d3ee]',
    accentColor: 'bg-[#06b6d4]',
    borderColor: 'border-slate-850',
    glowColor: 'rgba(34, 211, 238, 0.25)',
    bgColor: 'bg-[#020617]',
    canvasStyle: 'grid',
  },
  {
    id: 'cyberpunk_cyan',
    name: 'Sinal Cianeto (Cyber)',
    primaryColor: 'text-[#00ffcc]',
    accentColor: 'bg-[#00ffcc]',
    borderColor: 'border-[#00ffcc]/35',
    glowColor: 'rgba(0, 255, 204, 0.35)',
    bgColor: 'bg-slate-950',
    canvasStyle: 'stars',
  },
  {
    id: 'matrix_green',
    name: 'Código Bio-Terminal',
    primaryColor: 'text-[#10b981]',
    accentColor: 'bg-[#10b981]',
    borderColor: 'border-[#10b981]/30',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    bgColor: 'bg-zinc-950',
    canvasStyle: 'matrix',
  },
  {
    id: 'solar_orange',
    name: 'Labareda Solar',
    primaryColor: 'text-[#f97316]',
    accentColor: 'bg-[#f97316]',
    borderColor: 'border-[#f97316]/30',
    glowColor: 'rgba(249, 115, 22, 0.35)',
    bgColor: 'bg-stone-950',
    canvasStyle: 'grid',
  },
  {
    id: 'deep_space',
    name: 'Estrela Cósmica (Violet)',
    primaryColor: 'text-[#a855f7]',
    accentColor: 'bg-[#a855f7]',
    borderColor: 'border-[#a855f7]/30',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    bgColor: 'bg-slate-950',
    canvasStyle: 'glitch',
  },
  {
    id: 'stealth_carbon',
    name: 'Invasor Monocromo',
    primaryColor: 'text-zinc-400',
    accentColor: 'bg-zinc-400',
    borderColor: 'border-zinc-800',
    glowColor: 'rgba(255, 255, 255, 0.08)',
    bgColor: 'bg-zinc-950',
    canvasStyle: 'stars',
  }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeSelect,
  scanLines,
  setScanLines,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showroomTab, setShowroomTab] = React.useState<'dashboard' | 'components' | 'analytics'>('dashboard');

  // Get accent colors
  let hexColor = '#00ffcc';
  if (currentTheme.primaryColor.includes('#')) {
    const match = currentTheme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
    if (match) hexColor = `#${match[1]}`;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 p-3.5 rounded-full border bg-slate-950/90 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 group hover:shadow-[0_0_25px_rgba(0,0,0,0.9)] cursor-pointer"
        style={{ 
          borderColor: hexColor,
          boxShadow: `0 0 20px ${hexColor}40, inset 0 0 10px ${hexColor}15`
        }}
        title="Customizar Temas"
      >
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-slate-950/95 border border-slate-800 text-slate-300 px-2.5 py-1 rounded text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none uppercase">
          Customizar Tema
        </span>
        <Palette className="w-5.5 h-5.5 text-white" style={{ color: hexColor }} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      {/* Click outside to close wrapper */}
      <div className="absolute inset-0 cursor-default" onClick={() => setIsOpen(false)} />

      <div
        id="theme-selector"
        className={`relative w-full max-w-4xl rounded-2xl border p-4 sm:p-6 backdrop-blur-2xl bg-slate-950/95 ${currentTheme.borderColor} flex flex-col md:flex-row gap-6 transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.85)] z-10 animate-scaleUp my-auto`}
        style={{ boxShadow: `inset 0 0 20px ${hexColor}1A, 0 0 30px ${hexColor}1E` }}
      >
        {/* Visual scanning line top */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${currentTheme.accentColor} opacity-70 rounded-t-full glow-line`} />

        {/* Left Side: Theme customizer controls */}
        <div className="w-full md:w-80 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-900/80 pb-5 md:pb-0 pr-0 md:pr-6">
          <div>
            {/* Header HUD */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" style={{ color: hexColor }} />
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Customização de Temas</h3>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Aparência</span>
            </div>

            {/* List of themes */}
            <div className="space-y-2 mb-4">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Paletas de Cores</span>
              <div className="grid grid-cols-1 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                {THEMES_LIST.map((theme) => {
                  const active = currentTheme.id === theme.id;
                  let dotColor = '#00ffcc';
                  if (theme.primaryColor.includes('#')) {
                    const match = theme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
                    if (match) dotColor = `#${match[1]}`;
                  } else if (theme.primaryColor.includes('green')) {
                    dotColor = '#10b981';
                  } else if (theme.primaryColor.includes('orange')) {
                    dotColor = '#f97316';
                  } else if (theme.primaryColor.includes('violet') || theme.primaryColor.includes('purple')) {
                    dotColor = '#a855f7';
                  } else {
                    dotColor = '#a1a1aa';
                  }

                  return (
                    <button
                      key={theme.id}
                      onClick={() => onThemeSelect(theme)}
                      className={`flex items-center justify-between p-2 rounded border text-left cursor-pointer transition-colors ${
                        active
                          ? 'border-slate-700 bg-slate-900/60 text-white'
                          : 'border-slate-900/50 bg-slate-950/40 hover:bg-slate-900/40 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-800 shadow-md flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                        </span>
                        <span className="text-xs font-mono truncate">{theme.name}</span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-600 uppercase">
                        {theme.canvasStyle.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System toggles */}
            <div className="space-y-2 border-t border-slate-900/70 py-3">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Filtros Operacionais</span>

              <div className="flex items-center justify-between p-2 rounded bg-slate-950/30 border border-slate-900">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-slate-300">Linhas de Varredura scanlines</span>
                    <span className="text-[7px] font-mono text-slate-500 uppercase">Filtro CRT de Vídeo</span>
                  </div>
                </div>

                <button
                  onClick={() => setScanLines(!scanLines)}
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    scanLines
                      ? 'bg-emerald-950/45 border border-emerald-900/50 text-emerald-400'
                      : 'bg-slate-950 border border-slate-800 text-slate-600'
                  }`}
                >
                  {scanLines ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 mt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>TERMINAL CLIENT OK</span>
            <div className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-slate-600" />
              <span>V1.0.2</span>
            </div>
          </div>
        </div>

        {/* Right Side: Showcase Exhibits (Interactive Showroom for "Glassmorphic Flow") */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Showroom Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#38bdf8] font-bold">
                  Expositores de Conceito: Glassmorphic Flow
                </h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded items-center justify-center bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer hidden md:flex"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] font-mono text-slate-400 mb-4 uppercase tracking-normal">
              Protótipos dinâmicos baseados no design system <span className="text-white font-semibold">Glassmorphic Flow</span>. Toque nos botões de visualização para alternar os módulos conceituados:
            </p>

            {/* Pill-shaped tabs switcher */}
            <div className="flex gap-1.5 p-1 bg-slate-950/80 border border-slate-900 rounded-lg mb-4">
              <button
                onClick={() => setShowroomTab('dashboard')}
                className={`flex-1 py-2 px-2.5 rounded-md text-[10px] font-mono uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  showroomTab === 'dashboard'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-[inset_0_1px_3px_rgba(56,189,248,0.2)]'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-slate-900/40'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>01. Dashboard UI</span>
              </button>
              <button
                onClick={() => setShowroomTab('components')}
                className={`flex-1 py-2 px-2.5 rounded-md text-[10px] font-mono uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  showroomTab === 'components'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-[inset_0_1px_3px_rgba(56,189,248,0.2)]'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-slate-900/40'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>02. Design System</span>
              </button>
              <button
                onClick={() => setShowroomTab('analytics')}
                className={`flex-1 py-2 px-2.5 rounded-md text-[10px] font-mono uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  showroomTab === 'analytics'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-[inset_0_1px_3px_rgba(56,189,248,0.2)]'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-slate-900/40'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>03. Gráficos</span>
              </button>
            </div>

            {/* Interactive Showcase Frame (HTML/CSS Simulation of Prompt Designs) */}
            <div className="relative rounded-xl border border-white/10 overflow-hidden bg-slate-950/90 h-[215px] flex flex-col justify-center items-center shadow-inner animate-fadeIn">
              
              {/* Animated abstract backdrop blurs inside the mock canvas */}
              <div className="absolute inset-0 bg-slate-950" />
              <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-cyan-700/25 blur-3xl animate-pulse" />
              <div className="absolute -bottom-16 -right-12 w-44 h-44 rounded-full bg-indigo-700/20 blur-3xl" />
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-48 h-32 rounded-full bg-[#38bdf8]/10 blur-3xl" />

              {/* High precision Glass overlay content container */}
              <div className="absolute inset-0 p-4 z-10 flex flex-col justify-between overflow-y-auto">
                {showroomTab === 'dashboard' && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase text-slate-300 tracking-wider">Dashboard UI Principal</span>
                      </div>
                      <span className="text-[8px] font-mono text-sky-400 font-semibold uppercase px-1.5 py-0.2 bg-sky-950/60 border border-sky-800/50 rounded">ESTILO 02 ATIVO</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Mini Frosty Glass Card 1 */}
                      <div className="p-2.5 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-1.5 mb-1.5 text-[#38bdf8]">
                          <Sun className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
                          <span className="text-[9px] font-mono uppercase font-bold tracking-tight">SÃO PAULO</span>
                        </div>
                        <div className="text-lg font-bold font-sans text-white leading-none tracking-tight">21°C</div>
                        <span className="text-[8px] font-mono text-slate-400 block mt-1 uppercase">MODERADO (NÍVEL 2/3)</span>
                      </div>

                      {/* Mini Frosty Glass Card 2 */}
                      <div className="p-2.5 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-1.5 mb-1.5 text-emerald-400">
                          <DollarSign className="w-3.5 h-3.5 animate-pulse" />
                          <span className="text-[9px] font-mono uppercase font-bold tracking-tight">DÓLAR BRL</span>
                        </div>
                        <div className="text-lg font-bold font-mono text-white leading-none tracking-tight">R$ 5,34</div>
                        <span className="text-[8px] font-mono text-emerald-400 block mt-1 uppercase tracking-tight">+0,21% ALTA</span>
                      </div>
                    </div>

                    <p className="text-[9px] font-mono text-slate-400 leading-relaxed text-center italic">
                      "Painéis translúcidos de vidro fosco com brilhos sutis, tipografia fina e widgets premium."
                    </p>
                  </div>
                )}

                {showroomTab === 'components' && (
                  <div className="space-y-3.5 animate-fadeIn text-center flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5 text-left">
                      <span className="text-[10px] font-mono uppercase text-slate-300 tracking-wider">Componentes & Botões</span>
                      <span className="text-[8px] font-mono text-sky-505 uppercase font-semibold">DESIGN SYSTEM</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 my-1">
                      {/* Pill Shape Button Translucent */}
                      <button className="px-3.5 py-1.5 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 text-white text-[9px] font-mono tracking-widest uppercase cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]">
                        Botão Primário
                      </button>

                      {/* Secondary Translucent Button */}
                      <button className="px-3.5 py-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 text-[9px] font-mono tracking-widest uppercase cursor-pointer transition-all hover:scale-105 active:scale-95">
                        Botão Secundário
                      </button>

                      {/* Pills tabs concepts */}
                      <div className="flex rounded-full bg-slate-900/60 p-0.5 border border-white/5">
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[8px] font-mono font-medium">TAB 01</span>
                        <span className="px-2 py-0.5 text-slate-500 text-[8px] font-mono">TAB 02</span>
                      </div>
                    </div>

                    {/* Translucent interactive Slider */}
                    <div className="px-6 space-y-1">
                      <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase">
                        <span>Intensidade de Desfoque (Blur)</span>
                        <span className="text-sky-400 uppercase">65%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 border border-white/10 p-0.5 flex items-center relative">
                        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white border border-[#38bdf8] shadow absolute left-[64%] cursor-pointer hover:scale-125 transition-transform" />
                      </div>
                    </div>

                    <p className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider">
                      Design System com profundidade, botões translúcidos e drop-shadows macios.
                    </p>
                  </div>
                )}

                {showroomTab === 'analytics' && (
                  <div className="space-y-3.5 animate-fadeIn flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1">
                      <span className="text-[10px] font-mono uppercase text-slate-300 tracking-wider">Gráficos & Módulo Analítico</span>
                      <div className="flex items-center gap-1 text-[8px] font-mono text-emerald-400 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>SINAL OK: +15,4%</span>
                      </div>
                    </div>

                    {/* Responsive micro charting rendering */}
                    <div className="relative h-[110px] w-full flex-1">
                      <svg className="absolute inset-0 w-full h-full overflow-visible">
                        <defs>
                          {/* Radial Gradient under the curves for beautiful lighting */}
                          <linearGradient id="glow-cyan" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="glow-magenta" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d946ef" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Chart Line 1 - Translucent Cyan/Blue */}
                        <path
                          d="M 10 90 Q 60 20 110 70 T 210 45 T 310 15"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          className="drop-shadow-[0_2px_10px_rgba(56,189,248,0.5)]"
                        />
                        <path
                          d="M 10 90 Q 60 20 110 70 T 210 45 T 310 15 L 310 110 L 10 110 Z"
                          fill="url(#glow-cyan)"
                        />

                        {/* Chart Line 2 - Translucent Pink/Magenta */}
                        <path
                          d="M 10 65 Q 50 85 115 25 T 225 35 T 315 80"
                          fill="none"
                          stroke="#d946ef"
                          strokeWidth="1.5"
                          strokeDasharray="3 2"
                          className="drop-shadow-[0_2px_8px_rgba(217,70,239,0.3)]"
                        />

                        {/* Interactive floating indicator */}
                        <circle cx={160} cy={25} r="4.5" fill="#38bdf8" className="animate-ping" style={{ transformOrigin: '160px 25px' }} />
                        <circle cx={160} cy={25} r="3" fill="#ffffff" />
                        
                        <line x1={160} y1={25} x2={160} y2={100} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2 2" />
                      </svg>

                      {/* Floating tooltip simulation */}
                      <div className="absolute top-3 left-[175px] pt-1 px-1.5 rounded border border-white/10 bg-slate-950/90 text-[7.5px] font-mono text-white tracking-widest leading-normal shadow-md backdrop-blur-xl">
                        MÉTRICA: <span className="text-[#38bdf8] font-bold">R$ 385.716</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[8px] font-mono text-[#a1a1aa] uppercase leading-none border-t border-white/5 pt-1.5">
                      <span>Célula de Tendência: Ativa</span>
                      <span>Média Volátil: ok</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Showroom footer */}
          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-[#a1a1aa] uppercase">
            <span>Aparência e Profundidade Ativos</span>
            <span className="text-slate-500">[NATIVO PT-BR]</span>
          </div>
        </div>

      </div>
    </div>
  );
};
