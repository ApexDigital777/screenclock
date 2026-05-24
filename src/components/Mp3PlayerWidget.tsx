import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, UploadCloud, Trash2, Volume2, Sparkles, Headphones } from 'lucide-react';
import { ThemeConfig, Track } from '../types';
import { getTracksFromDB, saveTrackToDB, deleteTrackFromDB } from '../lib/indexedDB';

interface Mp3PlayerWidgetProps {
  theme: ThemeConfig;
}

// Built-in cool synth links (fully available via free standard links, wrapped safely)
const PRELOADED_TRACKS: Track[] = [
  {
    id: 'ambient_1',
    name: 'Sintetizador Orbital (Ambient Lofi)',
    isAmbient: true,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Classical fallback
  },
  {
    id: 'ambient_2',
    name: 'Frequência de Pulso Matrix (Deep Bass)',
    isAmbient: true,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  }
];

export const Mp3PlayerWidget: React.FC<Mp3PlayerWidgetProps> = ({ theme }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  
  // Custom audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Equalizer visual columns height tracker (simulated when playing)
  const [eqHeights, setEqHeights] = useState<number[]>([15, 20, 10, 30, 25, 40, 15, 20, 10, 30]);

  // Load custom playlists from DB
  useEffect(() => {
    const loadTracks = async () => {
      try {
        const storedTracks = await getTracksFromDB();
        setTracks([...PRELOADED_TRACKS, ...storedTracks]);
      } catch (err) {
        console.error('Failed to load tracks from IndexedDB:', err);
        setTracks(PRELOADED_TRACKS);
      }
    };
    loadTracks();
  }, []);

  // Update EQ bars when playing
  useEffect(() => {
    let eqInterval: number;
    if (isPlaying) {
      eqInterval = window.setInterval(() => {
        setEqHeights(
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 32) + 4)
        );
      }, 100);
    } else {
      setEqHeights(Array.from({ length: 12 }, () => 4));
    }
    return () => clearInterval(eqInterval);
  }, [isPlaying]);

  // Handle source swapping
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // Stop ongoing playbacks
    audioRef.current.pause();
    
    const activeTrack = tracks[activeTrackIndex];
    if (activeTrack) {
      if (activeTrack.isAmbient && activeTrack.audioUrl) {
        audioRef.current.src = activeTrack.audioUrl;
      } else if (activeTrack.fileData) {
        // Build direct secure local blob object URL
        audioRef.current.src = URL.createObjectURL(activeTrack.fileData);
      }
      audioRef.current.volume = volume;
      
      // Update values
      const onTimeUpdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };
      const onLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };
      const onTrackEnded = () => {
        handleNext();
      };

      audioRef.current.addEventListener('timeupdate', onTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
      audioRef.current.addEventListener('ended', onTrackEnded);

      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.warn('Playback interrupted or blocked by user engagement rules:', e);
          setIsPlaying(false);
        });
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', onTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
          audioRef.current.removeEventListener('ended', onTrackEnded);
        }
      };
    }
  }, [activeTrackIndex, tracks]);

  // Track volume updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.error(e);
          setIsPlaying(false);
        });
    }
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    const nextIdx = (activeTrackIndex + 1) % tracks.length;
    setActiveTrackIndex(nextIdx);
  };

  const handlePrev = () => {
    if (tracks.length === 0) return;
    const prevIdx = (activeTrackIndex - 1 + tracks.length) % tracks.length;
    setActiveTrackIndex(prevIdx);
  };

  const selectTrack = (index: number) => {
    setActiveTrackIndex(index);
    setIsPlaying(true);
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processUploadFiles(e.target.files);
    }
  };

  // Convert raw local files to custom Blobs
  const processUploadFiles = async (fileList: FileList) => {
    const acceptedFiles = Array.from(fileList).filter((f) => f.type.startsWith('audio/'));
    
    for (const file of acceptedFiles) {
      // Build custom tracks for DB persistence
      const newTrack: Track = {
        id: `uploaded_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: file.name.replace(/\.mp3$/i, ''),
        fileData: file, // Store blob directly
      };

      try {
        await saveTrackToDB(newTrack);
        setTracks((prev) => [...prev, newTrack]);
      } catch (err) {
        alert('Erro ao persistir faixa de áudio no IndexedDB do navegador.');
        console.error(err);
      }
    }
  };

  const deleteTrack = async (id: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTrackFromDB(id);
      
      const newTracks = tracks.filter((t) => t.id !== id);
      setTracks(newTracks);
      
      // If we deleted active, reset play coordinates
      if (activeTrackIndex === index) {
        setIsPlaying(false);
        setActiveTrackIndex(0);
      } else if (activeTrackIndex > index) {
        setActiveTrackIndex((prev) => prev - 1);
      }
    } catch (e) {
      console.error('Failed to delete custom track:', e);
    }
  };

  // Formatter helpers
  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get accent colors
  let hexColor = '#00ffcc';
  if (theme.primaryColor.includes('#')) {
    const match = theme.primaryColor.match(/#([A-Fa-f0-9]{3,6})/);
    if (match) hexColor = `#${match[1]}`;
  }

  const activeTrack = tracks[activeTrackIndex];

  return (
    <div
      id="mp3-player-widget"
      className={`relative rounded-2xl border p-4 backdrop-blur-md bg-slate-950/45 ${theme.borderColor} flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.55)]`}
      style={{ boxShadow: `inset 0 0 15px ${hexColor}0D` }}
    >
      {/* Visual scanning line top */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.accentColor} opacity-50 rounded-t-full glow-line`} />

      <div>
        {/* Header HUD */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4" style={{ color: hexColor }} />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">Módulo Áudio / Playlist</h3>
          </div>
          {isPlaying ? (
            <div className="flex items-end gap-[2px] h-[12px] pr-1">
              {eqHeights.map((h, i) => (
                <div
                  key={i}
                  className={`w-[2px] rounded-full transition-all duration-100 ${theme.accentColor}`}
                  style={{ height: `${(h / 40) * 12}px` }}
                />
              ))}
            </div>
          ) : (
            <span className="text-[9px] font-mono text-slate-600">STANDBY</span>
          )}
        </div>

        {/* Floating audio control bar */}
        {activeTrack && (
          <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg mb-3">
            <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider mb-0.5">REPRODUZINDO AGORA</span>
            <span className="text-xs font-mono text-slate-100 font-medium block truncate" title={activeTrack.name}>
              {activeTrack.name}
            </span>

            {/* Time progress indicators bar */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[9px] font-mono text-slate-500">{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-slate-900 rounded-full overflow-hidden relative">
                <div
                  className={`absolute left-0 top-0 bottom-0 ${theme.accentColor} transition-all duration-150`}
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-505">{formatTime(duration)}</span>
            </div>

            {/* Control HUD buttons */}
            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Anterior"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className={`p-2 rounded-full ${theme.accentColor} hover:scale-105 transition-all text-slate-950 cursor-pointer shadow-lg`}
                  title={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current stroke-[2.5]" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5 stroke-[2.5]" />}
                </button>
                <button
                  onClick={handleNext}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Próxima"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume sliders */}
              <div className="flex items-center gap-2 max-w-[80px]">
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-900 accent-emerald-500 rounded-lg cursor-pointer outline-none"
                  style={{ accentColor: hexColor }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Drag Drop Custom Upload Sector */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative p-2.5 rounded-lg border border-dashed transition-all mb-3 text-center ${
            dragActive
              ? `border-slate-400 bg-slate-950`
              : 'border-slate-800 bg-slate-950/20 hover:border-slate-700'
          }`}
        >
          <input
            type="file"
            id="audio-file-upload"
            accept="audio/mp3, audio/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="audio-file-upload" className="cursor-pointer block">
            <UploadCloud className="w-5 h-5 mx-auto mb-0.5 text-slate-500" />
            <span className="text-[10px] font-mono text-slate-400 block font-semibold">ESPAÇO DE EXPANSÃO MP3</span>
            <span className="text-[8px] font-mono text-slate-500 block">Solte MP3 ou clique para upload</span>
          </label>
        </div>

        {/* Custom and Preloaded tracks list view */}
        <div className="space-y-1.5 max-h-[85px] overflow-y-auto pr-1">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Músicas em Sincronia ({tracks.length})</span>
          {tracks.length === 0 ? (
            <div className="text-center py-4">
              <span className="text-[10px] font-mono text-slate-600 block">Carregando canais primordiais...</span>
            </div>
          ) : (
            tracks.map((track, i) => (
              <div
                key={track.id}
                onClick={() => selectTrack(i)}
                className={`flex items-center justify-between p-2 rounded border cursor-pointer group transition-colors ${
                  activeTrackIndex === i
                    ? 'border-emerald-900 bg-emerald-950/15 text-slate-100'
                    : 'border-slate-900/60 bg-slate-950/35 hover:bg-slate-900/35 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <Music className={`w-3.5 h-3.5 ${activeTrackIndex === i ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
                  <span className="text-[11px] font-mono truncate" title={track.name}>{track.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {track.isAmbient ? (
                    <span className="text-[8px] font-mono text-sky-500/80 uppercase px-1 rounded bg-sky-950/20 border border-sky-900/30">NUVEM</span>
                  ) : (
                    <>
                      <span className="text-[8px] font-mono text-purple-400/80 uppercase px-1 rounded bg-purple-950/20 border border-purple-900/30">LOCAL</span>
                      <button
                        onClick={(e) => deleteTrack(track.id, i, e)}
                        className="p-1 rounded text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Deletar Música"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/40 mt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
        <span>TECLADO DE SINAL DIGITAL</span>
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-slate-600" />
          <span>ESTÉREO</span>
        </div>
      </div>
    </div>
  );
};
