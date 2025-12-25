
import React, { useState, useRef, useEffect } from 'react';
import { generateAIVideo, generateVideoCaptions, generateAIImage, transcribeAudio, checkAndRequestApiKey } from '../services/geminiService';
import { VideoContent } from '../types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoCreated: (video: VideoContent) => void;
}

const VIDEO_STATUS_MESSAGES = [
  "Gemini is drafting the perfect script...",
  "Analyzing visual themes for your prompt...",
  "Harnessing Veo 3.1 to generate temporal frames...",
  "Synchronizing motion and consistency...",
  "Applying cinematic lighting and textures...",
  "Rendering high-fidelity video sequences...",
  "Almost there! Polishing the final output..."
];

const IMAGE_STATUS_MESSAGES = [
  "Gemini is sketching your vision...",
  "Adding intricate details and depth...",
  "Enhancing resolution and lighting...",
  "Finalizing your AI masterpiece..."
];

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onVideoCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [mode, setMode] = useState<'camera' | 'video' | 'image'>('camera');
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [isListening, setIsListening] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  // Camera recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const statusIntervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Camera Initialization
  useEffect(() => {
    if (isOpen && mode === 'camera' && !recordedVideoUrl) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, mode, recordedVideoUrl]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: true
      });
      setCameraStream(stream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Please allow camera access to record videos.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // Recording Logic
  const startRecording = () => {
    if (!cameraStream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm;codecs=vp8,opus' });
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setIsRecording(false);
      setRecordDuration(0);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);

    timerRef.current = window.setInterval(() => {
      setRecordDuration(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const discardRecording = () => {
    setRecordedVideoUrl(null);
    startCamera();
  };

  const handlePostRecording = () => {
    if (recordedVideoUrl) {
      onVideoCreated({
        id: Date.now().toString(),
        url: recordedVideoUrl,
        user: { 
          id: 'u1', 
          username: 'me', 
          avatar: 'https://picsum.photos/seed/me/100/100', 
          isFollowing: false 
        },
        description: "Freshly recorded on TikTok!",
        tags: ['original', 'vlog'],
        likes: 0, 
        comments: 0, 
        shares: 0,
        musicName: 'Original Sound',
      });
      onClose();
    }
  };

  // Status cycling for AI
  useEffect(() => {
    if (isGenerating) {
      const messages = mode === 'video' ? VIDEO_STATUS_MESSAGES : IMAGE_STATUS_MESSAGES;
      setStatus(messages[0]);
      setStatusIndex(0);

      statusIntervalRef.current = window.setInterval(() => {
        setStatusIndex((prev) => {
          const next = (prev + 1) % messages.length;
          setStatus(messages[next]);
          return next;
        });
      }, 8000);
    } else {
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
      setStatus('');
    }
    return () => {
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    };
  }, [isGenerating, mode]);

  const handleCreate = async () => {
    if (!prompt.trim()) return;
    await checkAndRequestApiKey();
    setIsGenerating(true);

    try {
      if (mode === 'video') {
        const captions = await generateVideoCaptions(prompt);
        const videoUrl = await generateAIVideo(prompt);
        if (videoUrl) {
          onVideoCreated({
            id: Date.now().toString(),
            url: videoUrl,
            user: { 
              id: 'ai_creator', 
              username: 'gemini_veo', 
              avatar: 'https://picsum.photos/seed/veo/100/100', 
              isFollowing: false 
            },
            description: `${captions.caption} ${captions.tags.map((t: string) => '#' + t).join(' ')}`,
            tags: captions.tags,
            likes: 0, 
            comments: 0, 
            shares: 0,
            musicName: 'Veo Original Sound - AI Gen',
          });
        }
      } else if (mode === 'image') {
        const imageUrl = await generateAIImage(prompt, imageSize);
        if (imageUrl) {
          onVideoCreated({
            id: Date.now().toString(),
            url: imageUrl,
            user: { 
              id: 'ai_creator', 
              username: 'gemini_image', 
              avatar: 'https://picsum.photos/seed/proimg/100/100', 
              isFollowing: false 
            },
            description: `AI Masterpiece: ${prompt}`,
            tags: ['ai', 'art', 'gemini'],
            likes: 0, 
            comments: 0, 
            shares: 0,
            musicName: 'Atmospheric AI - Background',
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center text-white overflow-hidden">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center p-8 bg-gradient-to-b from-black/60 to-transparent">
        <button 
          onClick={() => { discardRecording(); onClose(); }} 
          disabled={isGenerating || isRecording}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        {isRecording && (
          <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-xs font-bold">{Math.floor(recordDuration / 60)}:{(recordDuration % 60).toString().padStart(2, '0')}</span>
          </div>
        )}
        <div className="w-10"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full relative bg-zinc-900">
        {mode === 'camera' ? (
          <div className="h-full w-full relative">
            {recordedVideoUrl ? (
              <video 
                src={recordedVideoUrl} 
                className="h-full w-full object-cover" 
                controls 
                autoPlay 
                loop 
              />
            ) : (
              <video 
                ref={videoPreviewRef} 
                className="h-full w-full object-cover scale-x-[-1]" 
                autoPlay 
                muted 
                playsInline 
              />
            )}

            {/* Recording Controls */}
            {!recordedVideoUrl && (
              <div className="absolute bottom-32 left-0 right-0 flex flex-col items-center space-y-8 z-30">
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  className="relative group active:scale-90 transition-transform"
                >
                  <div className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1`}>
                    <div className={`w-full h-full rounded-full transition-all duration-300 ${isRecording ? 'bg-white scale-50 rounded-md' : 'bg-[#FE2C55]'}`}></div>
                  </div>
                  {!isRecording && <div className="absolute -inset-2 rounded-full border border-white/30 animate-ping opacity-20"></div>}
                </button>
              </div>
            )}

            {/* Action Buttons for recorded video */}
            {recordedVideoUrl && (
              <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-6 px-10 z-30">
                <button 
                  onClick={discardRecording}
                  className="flex-1 h-14 bg-zinc-800 rounded-2xl font-bold flex items-center justify-center space-x-2"
                >
                  <i className="fa-solid fa-trash"></i>
                  <span>Discard</span>
                </button>
                <button 
                  onClick={handlePostRecording}
                  className="flex-1 h-14 bg-[#FE2C55] rounded-2xl font-bold flex items-center justify-center space-x-2"
                >
                  <i className="fa-solid fa-check"></i>
                  <span>Post</span>
                </button>
              </div>
            )}
          </div>
        ) : isGenerating ? (
           <div className="h-full flex flex-col items-center justify-center p-10 text-center">
             <div className="relative mb-8">
                <div className={`w-24 h-24 border-4 rounded-full animate-spin ${mode === 'video' ? 'border-t-[#00f2ea] border-r-[#7000ff] border-zinc-800' : 'border-t-[#FE2C55] border-r-[#ff8c00] border-zinc-800'}`}></div>
                <i className={`fa-solid ${mode === 'video' ? 'fa-clapperboard' : 'fa-wand-magic-sparkles'} absolute inset-0 flex items-center justify-center text-2xl text-white`}></i>
             </div>
             <h3 className="text-xl font-bold mb-4">{status || "Preparing..."}</h3>
             <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full animate-progress transition-all duration-1000 ${mode === 'video' ? 'bg-[#00f2ea]' : 'bg-[#FE2C55]'}`}></div>
             </div>
           </div>
        ) : (
          <div className="h-full p-8 flex flex-col items-center justify-center space-y-8 max-w-md mx-auto">
             <header className="text-center">
                <h2 className="text-3xl font-black mb-2">Create with Gemini</h2>
                <p className="text-zinc-500 text-sm italic">"Turn words into cinematic realities"</p>
             </header>
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'video' ? "Describe your video..." : "Describe your image..."}
                className="w-full h-48 bg-zinc-800/50 border border-zinc-700 rounded-3xl p-6 text-white focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/50 resize-none"
             />
             <button
               onClick={handleCreate}
               disabled={!prompt.trim() || isGenerating}
               className={`w-full h-16 rounded-2xl font-black text-xl transition-all flex items-center justify-center space-x-3 ${!prompt.trim() ? 'bg-zinc-800 text-zinc-600' : 'bg-gradient-to-r from-[#FE2C55] to-[#ff0050] text-white'}`}
             >
               <i className={`fa-solid ${mode === 'video' ? 'fa-clapperboard' : 'fa-wand-sparkles'}`}></i>
               <span>Generate {mode === 'video' ? 'Video' : 'Image'}</span>
             </button>
          </div>
        )}
      </div>

      {/* Mode Switcher Footer */}
      {!isRecording && !recordedVideoUrl && !isGenerating && (
        <div className="w-full bg-black/80 backdrop-blur-xl border-t border-white/5 py-8 pb-12 flex justify-center space-x-8 px-4 z-40">
           <button 
            onClick={() => setMode('camera')}
            className={`text-xs font-black uppercase tracking-widest transition-all ${mode === 'camera' ? 'text-white scale-110' : 'text-zinc-600'}`}
          >
            Camera
          </button>
          <button 
            onClick={() => setMode('video')}
            className={`text-xs font-black uppercase tracking-widest transition-all ${mode === 'video' ? 'text-white scale-110' : 'text-zinc-600'}`}
          >
            AI Video
          </button>
          <button 
            onClick={() => setMode('image')}
            className={`text-xs font-black uppercase tracking-widest transition-all ${mode === 'image' ? 'text-white scale-110' : 'text-zinc-600'}`}
          >
            AI Image
          </button>
        </div>
      )}

      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); transform-origin: left; }
          100% { transform: scaleX(1); transform-origin: left; }
        }
        .animate-progress {
          animation: progress 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CreateModal;
