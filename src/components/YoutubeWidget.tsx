import React, { useState } from 'react';
import { Youtube, Play, Plus, Video, Radio, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types';

interface YoutubeWidgetProps {
  theme: ThemeConfig;
}

const EXT_PLAYLIST = [
  { id: 'f77SjSgqI2o', title: 'Cyberpunk Synthwave Ambient' },
  { id: '5WqG_h_P8M8', title: 'Deep Space Sci-Fi Soundscape' },
  { id: '4xDzrJKXOOY', title: 'Retro Future Coding Waves' },
];

export const YoutubeWidget: React.FC<YoutubeWidgetProps> = ({ theme }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [activeVideoId, setActiveVideoId] = useState('5WqG_h_P8M8');
  const [error, setError] = useState<string | null>(null);

  // Extract ID from full URL
  const extractVideoID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handlePlayUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!videoUrl.trim()) return;

    const id = extractVideoID(videoUrl);
    if (id) {
      setActiveVideoId(id);
      setVideoUrl('');
    } else {
      setError('Formato do link do YouTube inválido.');
    }
  };

  // Get accent color
  let hexColor = '#00ffcc';
  if (theme.primaryColor.includes('#')) {
    const match = theme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
    if (match) hexColor = `#${match[1]}`;
  }

  return (
    <div
      id="youtube-widget"
      className={`relative rounded-2xl border p-4 backdrop-blur-md bg-slate-950/45 ${theme.borderColor} flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.55)]`}
      style={{ boxShadow: `inset 0 0 15px ${hexColor}0D` }}
    >
      {/* Visual scanning line top */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.accentColor} opacity-50 rounded-t-full glow-line`} />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Youtube className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Terminal Vídeo Core</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" /> EMBED ATIVO
          </span>
        </div>

        {/* Player Canvas Frame */}
        <div className="relative mb-2 aspect-video bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
          {activeVideoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=0&mute=0&controls=1&rel=0&showinfo=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <div className="text-center p-4">
              <Video className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Nenhum canal sintonizado</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handlePlayUrl} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Cole o link do YouTube..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-slate-600 rounded px-2 py-1 text-xs text-white outline-none placeholder-slate-600 font-mono"
          />
          <button
            type="submit"
            className="px-2.5 bg-slate-950 border border-slate-800 hover:border-slate-500 hover:text-white text-slate-400 font-mono text-[10px] uppercase rounded transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" /> Sintonizar
          </button>
        </form>

        {error && (
          <div className="text-[10px] font-mono text-rose-400 mb-2">{error}</div>
        )}

        {/* Preloaded streams select */}
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">Canais Recomendados</span>
          <div className="grid grid-cols-1 gap-1 max-h-[75px] overflow-y-auto">
            {EXT_PLAYLIST.map((track) => (
              <button
                key={track.id}
                onClick={() => setActiveVideoId(track.id)}
                className={`flex items-center justify-between p-2 rounded border text-left cursor-pointer transition-colors ${
                  activeVideoId === track.id
                    ? 'border-rose-950 bg-rose-950/20 text-slate-100'
                    : 'border-slate-900 bg-slate-950/40 hover:bg-slate-900/40 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Play className={`w-3 h-3 ${activeVideoId === track.id ? 'text-rose-500' : 'text-slate-500'}`} />
                  <span className="text-[11px] font-mono truncate">{track.title}</span>
                </div>
                <span className="text-[8px] font-mono text-slate-600 uppercase">SYS_LINK</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/40 mt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>RESOLUÇÃO HUD COMPATÍVEL</span>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-slate-600 animate-pulse" />
          <span>CYBER VISUAL</span>
        </div>
      </div>
    </div>
  );
};
