
import React from 'react';

const FriendsScreen: React.FC = () => {
  return (
    <div className="flex-1 bg-black text-white flex flex-col pt-16 h-screen">
       <header className="px-6 pb-6 flex items-center justify-between border-b border-zinc-900">
        <h1 className="text-lg font-bold">Friends</h1>
        <div className="flex space-x-4">
          <i className="fa-solid fa-user-plus text-xl"></i>
          <i className="fa-solid fa-magnifying-glass text-xl"></i>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center justify-center p-10 space-y-8 pb-32">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#00f2ea] p-1 animate-pulse">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <i className="fa-solid fa-user-group text-4xl text-white"></i>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center border-4 border-black font-black">
            !
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black">Find your friends</h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
            Connect with people you know to see what they're creating with Gemini AI.
          </p>
        </div>

        <div className="w-full space-y-3">
          <button className="w-full h-14 bg-[#FE2C55] rounded-xl font-bold flex items-center justify-center space-x-3 shadow-lg shadow-[#FE2C55]/20">
            <i className="fa-solid fa-address-book"></i>
            <span>Find Contacts</span>
          </button>
          <button className="w-full h-14 bg-zinc-900 rounded-xl font-bold border border-zinc-800 flex items-center justify-center space-x-3 hover:bg-zinc-800 transition-colors">
            <i className="fa-brands fa-facebook"></i>
            <span>Find Facebook Friends</span>
          </button>
        </div>

        <div className="pt-8 w-full">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Suggested for you</h3>
              <span className="text-[10px] text-[#FE2C55] font-bold">See all</span>
           </div>
           <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="flex-shrink-0 w-36 bg-zinc-900/50 rounded-2xl p-4 flex flex-col items-center space-y-3 border border-zinc-800">
                  <img src={`https://picsum.photos/seed/friend${i}/100/100`} className="w-16 h-16 rounded-full" alt="" />
                  <div className="text-center">
                    <p className="text-xs font-bold truncate w-28">creator_{i}</p>
                    <p className="text-[9px] text-zinc-600">Follows you</p>
                  </div>
                  <button className="w-full py-1.5 bg-[#FE2C55] rounded-lg text-[10px] font-bold">Follow</button>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsScreen;
