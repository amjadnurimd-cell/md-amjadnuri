
import React from 'react';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const sections = [
    {
      title: 'Account',
      items: [
        { icon: 'fa-user', label: 'Manage account', description: 'Phone, email, password' },
        { icon: 'fa-lock', label: 'Privacy', description: 'Who can see your content' },
        { icon: 'fa-shield-halved', label: 'Security and login', description: 'Two-step verification' },
        { icon: 'fa-share-nodes', label: 'Share profile', description: 'Copy link, QR code' },
      ]
    },
    {
      title: 'AI & Creation',
      items: [
        { 
          icon: 'fa-wand-magic-sparkles', 
          label: 'Gemini API Settings', 
          description: 'Manage your AI project and billing',
          onClick: async () => {
            if (typeof window !== 'undefined' && window.aistudio) {
              await window.aistudio.openSelectKey();
            }
          }
        },
        { icon: 'fa-brain', label: 'AI Content Preferences', description: 'Customize creation style' },
        { icon: 'fa-video', label: 'Veo Video Quality', description: '720p, 1080p, and frame rate' },
      ]
    },
    {
      title: 'Content & Activity',
      items: [
        { icon: 'fa-clapperboard', label: 'Playback', description: 'Auto-play, captions' },
        { icon: 'fa-language', label: 'Language', description: 'App and content language' },
        { icon: 'fa-clock-rotate-left', label: 'Watch history', description: 'View your activity' },
      ]
    },
    {
      title: 'Support & Legal',
      items: [
        { icon: 'fa-circle-question', label: 'Help Center', description: 'Guides and support' },
        { icon: 'fa-file-lines', label: 'Terms and Privacy', description: 'Our legal agreements' },
        { icon: 'fa-circle-info', label: 'About TikTok', description: 'Version 1.2.0-beta' },
      ]
    }
  ];

  return (
    <div className="flex-1 bg-black text-white flex flex-col h-screen overflow-hidden animate-in fade-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="px-6 pt-16 pb-6 border-b border-zinc-900 flex items-center bg-black/80 backdrop-blur-xl z-10 sticky top-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors -ml-3">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg pr-7">Settings and privacy</h1>
      </header>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="mb-8">
            <h3 className="px-6 mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {section.title}
            </h3>
            <div className="bg-zinc-900/40 divide-y divide-zinc-800/50">
              {section.items.map((item, iIdx) => (
                <button 
                  key={iIdx}
                  onClick={item.onClick}
                  className="w-full flex items-center px-6 py-4 hover:bg-zinc-800/50 active:scale-[0.98] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-[#FE2C55]/20 group-hover:text-[#FE2C55] transition-colors mr-4">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-zinc-200 group-hover:text-white">{item.label}</p>
                    <p className="text-[11px] text-zinc-500">{item.description}</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-zinc-700"></i>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="px-6 space-y-4 pt-4">
          <button className="w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white font-bold text-sm hover:bg-zinc-800 transition-colors">
            Switch account
          </button>
          <button className="w-full py-4 bg-[#FE2C55]/10 border border-[#FE2C55]/20 rounded-2xl text-[#FE2C55] font-bold text-sm hover:bg-[#FE2C55]/20 transition-colors">
            Log out
          </button>
        </div>

        <p className="text-center text-[10px] text-zinc-600 mt-10 px-10">
          TikTok AI is a generative AI powered application. Please use responsibly and review our AI Content Guidelines.
        </p>
      </div>
    </div>
  );
};

export default SettingsScreen;
