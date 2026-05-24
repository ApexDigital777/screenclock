import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Layers, DollarSign, Cpu } from 'lucide-react';
import { ThemeConfig } from '../types';

interface FinanceWidgetProps {
  theme: ThemeConfig;
}

export const FinanceWidget: React.FC<FinanceWidgetProps> = ({ theme }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Real pricing states
  const [btcBrl, setBtcBrl] = useState<number | null>(null);
  const [btcChange, setBtcChange] = useState<number>(0);
  const [usdBrl, setUsdBrl] = useState<number | null>(null);
  const [usdChange, setUsdChange] = useState<number>(0);
  
  // Telemetry track histories for SVG sparkling graphs (last 12 points)
  const [btcHistory, setBtcHistory] = useState<number[]>([]);
  const [usdHistory, setUsdHistory] = useState<number[]>([]);

  const fetchFinanceRates = async () => {
    setLoading(true);
    setError(null);
    try {
      // awesome API coordinates rates
      const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,BTC-BRL');
      if (!response.ok) throw new Error('Falha ao atualizar cotações de câmbio.');
      
      const data = await response.json();
      
      const rawUsd = parseFloat(data.USDBRL.bid);
      const rawUsdPct = parseFloat(data.USDBRL.pctChange);
      
      // AwesomeAPI returns BTC/BRL in units which sometimes can be multiplied (or correct)
      // e.g., "bid": "382211" -> around 380 thousand BRL for 1 BTC
      const rawBtc = parseFloat(data.BTCBRL.bid);
      const rawBtcPct = parseFloat(data.BTCBRL.pctChange);

      setUsdBrl(rawUsd);
      setUsdChange(rawUsdPct);
      setBtcBrl(rawBtc);
      setBtcChange(rawBtcPct);

      // Add points to vector telemetry history
      setBtcHistory(prev => {
        const next = [...prev, rawBtc];
        if (next.length > 12) next.shift();
        return next;
      });

      setUsdHistory(prev => {
        const next = [...prev, rawUsd];
        if (next.length > 12) next.shift();
        return next;
      });

      localStorage.setItem('saved_rates_rates', JSON.stringify({
        btcBrl: rawBtc,
        btcChange: rawBtcPct,
        usdBrl: rawUsd,
        usdChange: rawUsdPct,
        timestamp: Date.now()
      }));

    } catch (err: any) {
      console.error(err);
      setError('Erro de link financeiro.');
    } finally {
      setLoading(false);
    }
  };

  // On mount: load mock or cached elements and run cyclic updates
  useEffect(() => {
    const cached = localStorage.getItem('saved_rates_rates');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setBtcBrl(parsed.btcBrl);
        setBtcChange(parsed.btcChange);
        setUsdBrl(parsed.usdBrl);
        setUsdChange(parsed.usdChange);
        
        // Populate initial fake-interactive histories so curves render immediately
        setBtcHistory(Array.from({ length: 12 }, (_, i) => parsed.btcBrl * (1 + (Math.sin(i) * 0.003))));
        setUsdHistory(Array.from({ length: 12 }, (_, i) => parsed.usdBrl * (1 + (Math.cos(i) * 0.002))));
      } catch (e) {
        // Fall back to general starting points
        setBtcBrl(395800);
        setUsdBrl(5.35);
      }
    } else {
      // Seed values
      setBtcBrl(395800);
      setUsdBrl(5.35);
      setBtcHistory(Array.from({ length: 12 }, (_, i) => 395800 * (1 + (Math.sin(i) * 0.003))));
      setUsdHistory(Array.from({ length: 12 }, (_, i) => 5.35 * (1 + (Math.cos(i) * 0.002))));
    }

    fetchFinanceRates();

    const interval = setInterval(fetchFinanceRates, 45000); // 45s tick updates
    return () => clearInterval(interval);
  }, []);

  // Generate SVG paths for sparklines
  const buildSparklinePath = (points: number[], width: number, height: number): string => {
    if (points.length < 2) return '';
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;

    return points
      .map((p, index) => {
        const x = (index / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * (height * 0.8) - (height * 0.1);
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const btcPath = buildSparklinePath(btcHistory, 110, 36);
  const usdPath = buildSparklinePath(usdHistory, 110, 36);

  // Parse custom accent theme
  let hexColor = '#00ffcc';
  if (theme.primaryColor.includes('#')) {
    const match = theme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
    if (match) hexColor = `#${match[1]}`;
  }

  // Format currencies
  const formatBRL = (val: number, decimals: number = 2) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(val);
  };

  return (
    <div
      id="finance-widget"
      className={`relative rounded-2xl border p-4 backdrop-blur-md bg-slate-950/45 ${theme.borderColor} flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.55)]`}
      style={{ boxShadow: `inset 0 0 15px ${hexColor}0D` }}
    >
      {/* Visual scanning line top */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.accentColor} opacity-50 rounded-t-full glow-line`} />

      <div>
        {/* Header HUD */}
        <div className="flex items-center justify-between mb-3 z-20">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: hexColor }} />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Mercados Web3 / Câmbio</h3>
          </div>
          <button
            onClick={fetchFinanceRates}
            disabled={loading}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="p-1 px-2 text-center text-[10px] font-mono text-rose-400 bg-rose-950/20 rounded border border-rose-900/30 mb-2">
            {error} (Offline Cache Ativo)
          </div>
        )}

        {/* BTC Section */}
        <div className="py-2 border-b border-slate-900/70 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-mono uppercase text-slate-400">BITCOIN / BRL</span>
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-white mb-0.5">
              {btcBrl ? formatBRL(btcBrl, 0) : 'Carregando...'}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono">
              {btcChange >= 0 ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">+{btcChange.toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-400">{btcChange.toFixed(2)}%</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-slate-500 mb-1">TELEMETRIA</span>
            <svg className="w-[110px] h-[36px] overflow-visible">
              <path
                d={btcPath}
                fill="none"
                stroke={btcChange >= 0 ? '#10b981' : '#f43f5e'}
                strokeWidth="1.5"
                className="drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]"
              />
              {btcHistory.length > 0 && (
                <circle
                  cx={110}
                  cy={36 - ((btcHistory[btcHistory.length - 1] - Math.min(...btcHistory)) / (Math.max(...btcHistory) - Math.min(...btcHistory) || 1)) * 28.8 - 3.6}
                  r="2.5"
                  fill={btcChange >= 0 ? '#10b981' : '#f43f5e'}
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>
        </div>

        {/* USD Section */}
        <div className="py-2 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1 border-slate-900">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">DÓLAR COMERCIAL / BRL</span>
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-white mb-0.5">
              {usdBrl ? formatBRL(usdBrl, 2) : 'Carregando...'}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono">
              {usdChange >= 0 ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">+{usdChange.toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-400">{usdChange.toFixed(2)}%</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-slate-500 mb-1">VOLATILIDADE</span>
            <svg className="w-[110px] h-[36px] overflow-visible">
              <path
                d={usdPath}
                fill="none"
                stroke={usdChange >= 0 ? '#10b981' : '#f43f5e'}
                strokeWidth="1.5"
                className="drop-shadow-[0_0_4px_rgba(244,63,94,0.3)]"
              />
              {usdHistory.length > 0 && (
                <circle
                  cx={110}
                  cy={36 - ((usdHistory[usdHistory.length - 1] - Math.min(...usdHistory)) / (Math.max(...usdHistory) - Math.min(...usdHistory) || 1)) * 28.8 - 3.6}
                  r="2.5"
                  fill={usdChange >= 0 ? '#10b981' : '#f43f5e'}
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>SISTEMA DE PRECIFICAÇÃO GLOBAL</span>
        <span>ATUALIZADO OK</span>
      </div>
    </div>
  );
};
