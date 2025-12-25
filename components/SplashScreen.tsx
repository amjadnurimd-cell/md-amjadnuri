
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[999]">
      <div className="relative mb-12 animate-in zoom-in duration-700">
        {/* TikTok Glitch Effect Simulation */}
        <div className="relative w-24 h-24">
           <i className="fa-brands fa-tiktok text-8xl text-[#FE2C55] absolute -left-1 top-1 opacity-70 blur-[1px] animate-glitch-red"></i>
           <i className="fa-brands fa-tiktok text-8xl text-[#25F4EE] absolute left-1 -top-1 opacity-70 blur-[1px] animate-glitch-cyan"></i>
           <i className="fa-brands fa-tiktok text-8xl text-white relative"></i>
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-2xl font-black text-white tracking-tighter">TikTok</h1>
        <div className="flex items-center space-x-2">
           <div className="w-1.5 h-1.5 bg-[#FE2C55] rounded-full animate-bounce"></div>
           <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
           <div className="w-1.5 h-1.5 bg-[#25F4EE] rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>

      <style>{`
        @keyframes glitch-red {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(-3px, -2px); }
          60% { transform: translate(3px, 2px); }
          80% { transform: translate(3px, -2px); }
        }
        @keyframes glitch-cyan {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(3px, -2px); }
          40% { transform: translate(3px, 2px); }
          60% { transform: translate(-3px, -2px); }
          80% { transform: translate(-3px, 2px); }
        }
        .animate-glitch-red {
          animation: glitch-red 0.15s ease-in-out infinite;
        }
        .animate-glitch-cyan {
          animation: glitch-cyan 0.15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
