
import React from 'react';

const InboxScreen: React.FC = () => {
  const categories = [
    { icon: 'fa-user-plus', label: 'New followers', color: 'bg-blue-500' },
    { icon: 'fa-at', label: 'Mentions', color: 'bg-purple-500' },
    { icon: 'fa-heart', label: 'All activity', color: 'bg-[#FE2C55]' }
  ];

  const messages = [
    { id: 1, user: 'Gemini AI', text: 'Your video is trending in the AI category!', time: '2m', type: 'system' },
    { id: 2, user: 'alex_j', text: 'liked your comment.', time: '1h', type: 'activity' },
    { id: 3, user: 'pixel_art', text: 'started following you.', time: '4h', type: 'follower' },
    { id: 4, user: 'Creative Team', text: 'Check out the new Veo 3.1 features!', time: '1d', type: 'system' }
  ];

  return (
    <div className="flex-1 bg-black text-white flex flex-col pt-16 h-screen">
      <header className="px-6 pb-6 flex items-center justify-between border-b border-zinc-900">
        <h1 className="text-lg font-bold">Inbox</h1>
        <i className="fa-solid fa-paper-plane text-xl"></i>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Categories */}
        <div className="flex justify-around py-8 border-b border-zinc-900">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl text-white ${cat.color} shadow-lg shadow-${cat.color.split('-')[1]}-500/20`}>
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <span className="text-[11px] font-medium text-zinc-400">{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="px-6 py-6 space-y-8">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Recent activity</h3>
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start justify-between group">
                <div className="flex space-x-4">
                  <div className="relative">
                    <img 
                      src={`https://picsum.photos/seed/${msg.user}/100/100`} 
                      className="w-12 h-12 rounded-full border border-zinc-800" 
                      alt="" 
                    />
                    {msg.type === 'system' && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00f2ea] rounded-full border-2 border-black flex items-center justify-center">
                        <i className="fa-solid fa-bolt text-[8px] text-black"></i>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold mr-1">{msg.user}</span>
                      <span className="text-zinc-400">{msg.text}</span>
                    </p>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">{msg.time}</span>
                  </div>
                </div>
                <div className="w-10 h-14 bg-zinc-900 rounded-md overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-tr from-zinc-800 to-zinc-700 opacity-50"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxScreen;
