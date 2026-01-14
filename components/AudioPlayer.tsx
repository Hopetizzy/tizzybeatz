
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Repeat, Shuffle, Layers, Radio, Mic2 } from 'lucide-react';
import { Product } from '../types';

interface AudioPlayerProps {
  currentTrack: Product | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentTrack, isPlaying, onTogglePlay, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-5xl z-[60] px-4 animate-in slide-in-from-bottom-12 duration-700">
      <div className="glass rounded-[32px] border border-white/10 p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden group">

        {/* Universal Close Button - Highly Visible */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-950/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-white/5 active:scale-90"
          title="Close Player"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* Hardware details top strip */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>

        <audio
          ref={audioRef}
          src={currentTrack.audioPreviewUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onTogglePlay}
        />

        <div className="flex flex-col md:flex-row items-center gap-6 pr-12 md:pr-0">
          {/* Left: Track Info & Artwork */}
          <div className="flex items-center gap-4 w-full md:w-1/3">
            <div className="relative w-16 h-16 flex-shrink-0 group/artwork">
              <div className={`absolute inset-0 bg-brand-500/20 blur-xl transition-all duration-500 ${isPlaying ? 'scale-125 opacity-100' : 'scale-75 opacity-0'}`}></div>
              <img src={currentTrack.thumbnailUrl} alt="" className="relative w-full h-full object-cover rounded-2xl border border-white/10" />
              <div className="absolute -bottom-1 -right-1 p-1 bg-brand-600 rounded-lg text-white shadow-lg">
                <Mic2 size={10} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-white truncate uppercase tracking-tight">{currentTrack.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                {currentTrack.type} • <span className="text-brand-400">{currentTrack.bpm || 'VAR'} BPM</span>
              </p>
            </div>
          </div>

          {/* Center: Playback Controls & Progress */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center justify-center gap-6">
              <button className="text-slate-500 hover:text-white transition-colors active:scale-90"><Shuffle size={16} /></button>
              <button className="text-slate-500 hover:text-white transition-colors active:scale-90"><SkipBack size={20} fill="currentColor" /></button>
              <button
                onClick={onTogglePlay}
                className="w-12 h-12 bg-white text-slate-950 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
              </button>
              <button className="text-slate-500 hover:text-white transition-colors active:scale-90"><SkipForward size={20} fill="currentColor" /></button>
              <button className="text-slate-500 hover:text-white transition-colors active:scale-90"><Repeat size={16} /></button>
            </div>

            <div className="relative flex items-center gap-3">
              <span className="text-[9px] font-mono text-slate-500 w-8">
                {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ':' + ('0' + Math.floor(audioRef.current.currentTime % 60)).slice(-2) : '0:00'}
              </span>
              <div className="relative flex-1 h-6 flex items-center group/slider">
                <div className="absolute inset-x-0 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-accent-400 shadow-[0_0_12px_rgba(217,70,239,0.5)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-[9px] font-mono text-slate-500 w-8">
                {duration ? Math.floor(duration / 60) + ':' + ('0' + Math.floor(duration % 60)).slice(-2) : '0:00'}
              </span>
            </div>
          </div>

          {/* Right: Audio Matrix Controls */}
          <div className="hidden lg:flex items-center justify-end gap-6 w-1/3">
            <div className="flex items-center gap-3 group/vol">
              <Volume2 size={16} className="text-slate-500 group-hover/vol:text-brand-400 transition" />
              <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 group-hover/vol:bg-brand-500 transition-all" style={{ width: `${volume * 100}%` }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 border-l border-white/5 pl-6">
              <button className="p-2 text-slate-500 hover:text-brand-400 transition-colors" title="View Stems"><Layers size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
