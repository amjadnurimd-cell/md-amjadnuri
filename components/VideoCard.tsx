import React, { useState, useRef, useEffect } from 'react';
import { VideoContent, Comment } from '../types';
import { analyzeVideoContent } from '../services/geminiService';

interface VideoCardProps {
  video: VideoContent;
}

const ANALYSIS_OPTIONS = [
  { id: 'summary', label: 'Summarize Actions', prompt: 'Summarize the main key actions happening in this video.' },
  { id: 'objects', label: 'Identify Objects', prompt: 'List and describe the key objects and people visible in this video.' },
  { id: 'sentiment', label: 'Analyze Sentiment', prompt: 'Analyze the emotional sentiment and mood conveyed by this video.' },
  { id: 'tags', label: 'Suggest Tags', prompt: 'Suggest 5 highly relevant and trending TikTok hashtags based on this video content.' }
];

const MOCK_COMMENTS: Comment[] = [
  { id: 'c1', username: 'alex_j', text: 'This is actually insane! How did you edit this? 🔥', likes: 124, time: '2h' },
  { id: 'c2', username: 'pixel_art', text: 'The lighting is perfect. Reminds me of Blade Runner.', likes: 89, time: '5h' },
  { id: 'c3', username: 'creativ_soul', text: 'Gemini really did a great job on this prompt.', likes: 45, time: '1d' },
  { id: 'c4', username: 'tech_guru', text: 'Wait, is this really AI? The temporal consistency is 10/10.', likes: 231, time: '3h' },
];

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showPromptPicker, setShowPromptPicker] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [heartAnims, setHeartAnims] = useState<{ id: number; x: number; y: number }[]>([]);

  // Custom Controls State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPlaying(true);
            videoRef.current?.play().catch(() => {});
          } else {
            setPlaying(false);
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleVideoTap = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      setLiked(true);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newHeart = { id: now, x, y };
      setHeartAnims(prev => [...prev, newHeart]);
      
      setTimeout(() => {
        setHeartAnims(prev => prev.filter(h => h.id !== newHeart.id));
      }, 1000);
    } else {
      // Single tap
      togglePlay(e);
    }
    lastTapRef.current = now;
  };

  const togglePlay = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.player-controls') || 
        (e.target as HTMLElement).closest('.side-actions') ||
        (e.target as HTMLElement).closest('.bottom-sheet')) {
      return;
    }
    
    if (playing) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play().catch(() => {});
    }
    setPlaying(!playing);
    resetControlsTimeout();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const openAnalysisMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showPromptPicker || analysis || analyzing) {
      setAnalysis(null);
      setAnalyzing(false);
      setShowPromptPicker(false);
      setSelectedPromptId(null);
    } else {
      setShowPromptPicker(true);
    }
  };

  const handleSelectPrompt = async (option: typeof ANALYSIS_OPTIONS[0]) => {
    setAnalyzing(true);
    setShowPromptPicker(false);
    setSelectedPromptId(option.id);
    setAnalysis(null);
    
    try {
      const result = await analyzeVideoContent(video.url, option.prompt);
      setAnalysis(result || "Could not analyze.");
    } catch (err) {
      setAnalysis("Analysis error.");
    } finally {
      setAnalyzing(false);
    }
  };

  const onTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
    resetControlsTimeout();
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      setIsMuted(v === 0);
      videoRef.current.muted = v === 0;
    }
    resetControlsTimeout();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMute = !isMuted;
    setIsMuted(newMute);
    if (videoRef.current) {
      videoRef.current.muted = newMute;
      if (!newMute && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
    resetControlsTimeout();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="video-snap relative flex items-center justify-center bg-black overflow-hidden group"
      onClick={handleVideoTap}
      onMouseMove={resetControlsTimeout}
    >
      {video.url.includes('data:image') ? (
        <img src={video.url} className="h-full w-full object-cover" alt="AI Generated" />
      ) : (
        <video
          ref={videoRef}
          src={video.url}
          className="h-full w-full object-cover"
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
        />
      )}

      {/* Double Tap Heart Animations */}
      {heartAnims.map(heart => (
        <div 
          key={heart.id} 
          className="absolute pointer-events-none z-[100] animate-heart-pop"
          style={{ left: heart.x, top: heart.y }}
        >
          <i className="fa-solid fa-heart text-[#FE2C55] text-8xl drop-shadow-2xl opacity-80"></i>
        </div>
      ))}

      {/* Custom Video Controls Overlay */}
      <div className={`player-controls absolute inset-x-0 bottom-0 z-[40] transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pb-20 space-y-3">
          <div className="flex items-center space-x-3 group/seekbar">
            <span className="text-[10px] text-white/70 font-mono w-8">{formatTime(currentTime)}</span>
            <input 
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={onSeek}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#FE2C55] group-hover/seekbar:h-2 transition-all"
            />
            <span className="text-[10px] text-white/70 font-mono w-8">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={(e) => { e.stopPropagation(); togglePlay(e); }}
                className="text-white hover:text-[#FE2C55] transition-colors"
              >
                <i className={`fa-solid ${playing ? 'fa-pause' : 'fa-play'} text-xl`}></i>
              </button>
              <div className="flex items-center space-x-2 group/volume">
                <button onClick={toggleMute} className="text-white">
                  <i className={`fa-solid ${isMuted || volume === 0 ? 'fa-volume-xmark' : volume < 0.5 ? 'fa-volume-low' : 'fa-volume-high'} text-lg w-6`}></i>
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={onVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-0 group-hover/volume:w-20 transition-all h-1 bg-white/20 rounded-full appearance-none accent-white overflow-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Panel */}
      { (showPromptPicker || analyzing || analysis) && (
        <div className="absolute inset-x-0 bottom-0 bg-black/90 backdrop-blur-xl z-[60] p-6 pb-28 rounded-t-3xl border-t border-white/10 animate-slide-up shadow-2xl" onClick={(e) => e.stopPropagation()}>
           <div className="flex justify-between items-center mb-5">
             <div className="flex items-center space-x-2">
               <div className="w-2 h-2 rounded-full bg-[#00f2ea] animate-pulse"></div>
               <h4 className="text-[#00f2ea] text-[10px] font-bold uppercase tracking-widest">Gemini Intelligence</h4>
             </div>
             <button onClick={(e) => { e.stopPropagation(); setAnalysis(null); setAnalyzing(false); setShowPromptPicker(false); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5">
               <i className="fa-solid fa-xmark text-white/50"></i>
             </button>
           </div>
           {showPromptPicker && (
             <div className="grid grid-cols-2 gap-2">
               {ANALYSIS_OPTIONS.map((option) => (
                 <button key={option.id} onClick={(e) => { e.stopPropagation(); handleSelectPrompt(option); }} className="p-3 text-left bg-zinc-800/50 hover:bg-[#00f2ea]/10 border border-zinc-700 hover:border-[#00f2ea]/30 rounded-xl transition-all group">
                   <p className="text-xs font-bold text-zinc-300 group-hover:text-[#00f2ea]">{option.label}</p>
                 </button>
               ))}
             </div>
           )}
           {analyzing && (
             <div className="flex flex-col items-center py-8 space-y-4">
               <div className="w-10 h-10 border-2 border-t-[#00f2ea] border-white/10 rounded-full animate-spin"></div>
               <span className="text-sm text-zinc-400 font-medium">Deep reasoning...</span>
             </div>
           )}
           {analysis && (
             <div className="max-h-60 overflow-y-auto pr-2 no-scrollbar">
               <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{analysis}</p>
             </div>
           )}
        </div>
      )}

      {/* Comment Bottom Sheet */}
      {showComments && (
        <>
          <div className="absolute inset-0 bg-black/40 z-[70]" onClick={() => setShowComments(false)}></div>
          <div className="absolute inset-x-0 bottom-0 bg-[#121212] z-[80] rounded-t-2xl flex flex-col max-h-[70vh] animate-slide-up bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center p-4 border-b border-zinc-800">
              <div className="w-10 h-1 bg-zinc-700 rounded-full mb-4"></div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">{video.comments} Comments</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
              {MOCK_COMMENTS.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <img src={`https://picsum.photos/seed/${comment.username}/40/40`} className="w-9 h-9 rounded-full" alt="" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-zinc-400">{comment.username}</span>
                      <span className="text-[10px] text-zinc-600">{comment.time}</span>
                    </div>
                    <p className="text-sm text-white leading-snug">{comment.text}</p>
                    <div className="flex items-center space-x-4 pt-1">
                      <span className="text-[10px] font-bold text-zinc-500">Reply</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center pt-1">
                    <i className="fa-regular fa-heart text-zinc-500 text-sm"></i>
                    <span className="text-[9px] text-zinc-500">{comment.likes}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-3">
              <img src="https://picsum.photos/seed/me/40/40" className="w-8 h-8 rounded-full" alt="" />
              <input 
                type="text" 
                placeholder="Add comment..." 
                className="flex-1 bg-zinc-800 border-none rounded-full px-4 py-2 text-sm text-white focus:ring-1 focus:ring-[#FE2C55]"
              />
              <button className="text-[#FE2C55] font-bold text-sm">Post</button>
            </div>
          </div>
        </>
      )}

      {/* Share Bottom Sheet */}
      {showShare && (
        <>
          <div className="absolute inset-0 bg-black/40 z-[70]" onClick={() => setShowShare(false)}></div>
          <div className="absolute inset-x-0 bottom-0 bg-[#121212] z-[80] rounded-t-2xl p-6 animate-slide-up bottom-sheet" onClick={e => e.stopPropagation()}>
            <h3 className="text-center font-bold text-sm mb-6">Send to</h3>
            <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-6 mb-6 border-b border-zinc-800">
              {['u1', 'u2', 'u3', 'u4', 'u5'].map(u => (
                <div key={u} className="flex flex-col items-center space-y-2 flex-shrink-0">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/${u}/60/60`} className="w-14 h-14 rounded-full" alt="" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#121212] rounded-full"></div>
                  </div>
                  <span className="text-[10px] text-zinc-400">Friend {u}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-y-6">
              {[
                { icon: 'fa-link', label: 'Copy Link', color: 'bg-zinc-800' },
                { icon: 'fa-whatsapp', label: 'WhatsApp', color: 'bg-green-600' },
                { icon: 'fa-instagram', label: 'Instagram', color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' },
                { icon: 'fa-envelope', label: 'SMS', color: 'bg-blue-500' },
                { icon: 'fa-download', label: 'Save Video', color: 'bg-zinc-800' },
                { icon: 'fa-flag', label: 'Report', color: 'bg-zinc-800' },
                { icon: 'fa-ban', label: 'Not Interested', color: 'bg-zinc-800' },
                { icon: 'fa-user-plus', label: 'Duet', color: 'bg-zinc-800' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl text-white ${item.color}`}>
                    <i className={`fa-brands ${item.icon.startsWith('fa-') ? (item.icon.includes('whatsapp') || item.icon.includes('instagram') ? 'fa-brands' : 'fa-solid') : 'fa-solid'} ${item.icon}`}></i>
                  </div>
                  <span className="text-[10px] text-zinc-400 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Side Actions */}
      <div className="side-actions absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-20">
        <div className="relative mb-4">
          <img 
            src={video.user.avatar} 
            alt={video.user.username} 
            className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FE2C55] rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
            <i className="fa-solid fa-plus text-white text-[10px]"></i>
          </div>
        </div>

        <button onClick={handleLike} className="flex flex-col items-center group transition-transform active:scale-125">
          <i className={`fa-solid fa-heart text-3xl drop-shadow-lg ${liked ? 'text-[#FE2C55]' : 'text-white'}`}></i>
          <span className="text-white text-xs mt-1 font-semibold">{video.likes + (liked ? 1 : 0)}</span>
        </button>

        <button onClick={openAnalysisMenu} className="flex flex-col items-center group">
          <div className={`p-2 rounded-full transition-all ${analysis || analyzing || showPromptPicker ? 'bg-[#00f2ea] text-black scale-110 shadow-[0_0_15px_rgba(0,242,234,0.5)]' : 'bg-black/20 text-white'}`}>
            <i className="fa-solid fa-brain text-2xl"></i>
          </div>
          <span className="text-white text-[10px] mt-1 font-bold uppercase tracking-tight">AI Analyze</span>
        </button>

        <button onClick={(e) => { e.stopPropagation(); setShowComments(true); }} className="flex flex-col items-center">
          <i className="fa-solid fa-comment-dots text-3xl text-white drop-shadow-lg"></i>
          <span className="text-white text-xs mt-1 font-semibold">{video.comments}</span>
        </button>

        <button onClick={(e) => { e.stopPropagation(); setShowShare(true); }} className="flex flex-col items-center">
          <i className="fa-solid fa-share text-3xl text-white drop-shadow-lg"></i>
          <span className="text-white text-xs mt-1 font-semibold">{video.shares}</span>
        </button>

        <div className="animate-spin-slow">
           <div className="w-10 h-10 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center overflow-hidden shadow-lg">
             <div className="w-full h-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 animate-gradient-xy" />
           </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute left-4 bottom-20 right-20 text-white z-20 pointer-events-none">
        <h3 className="font-bold text-base mb-2 drop-shadow-lg pointer-events-auto">@{video.user.username}</h3>
        <p className="text-sm line-clamp-3 mb-2 leading-relaxed drop-shadow-md pointer-events-auto">{video.description}</p>
        <div className="flex items-center space-x-2 text-sm overflow-hidden whitespace-nowrap bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 w-fit pointer-events-auto">
          <i className="fa-solid fa-music text-[10px]"></i>
          <div className="animate-marquee overflow-hidden">
             <span className="text-xs font-medium">{video.musicName}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heart-pop {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          20% { transform: scale(1.2) rotate(10deg); opacity: 1; }
          80% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          100% { transform: scale(1.5) translateY(-100px); opacity: 0; }
        }
        .animate-heart-pop {
          animation: heart-pop 0.8s ease-out forwards;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 10s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 3s ease infinite;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #FE2C55;
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
          margin-top: -4px;
        }
      `}</style>
    </div>
  );
};

export default VideoCard;