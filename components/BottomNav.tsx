
import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onCreateClick }) => {
  const tabs = [
    { id: 'home', icon: 'fa-house', label: 'Home' },
    { id: 'friends', icon: 'fa-user-group', label: 'Friends' },
    { id: 'create', icon: 'plus', label: '' },
    { id: 'inbox', icon: 'fa-message', label: 'Inbox' },
    { id: 'profile', icon: 'fa-user', label: 'Profile' }
  ];

  return (
    <div className="absolute bottom-0 w-full h-[72px] bg-black border-t border-white/5 flex items-center justify-around px-2 z-50 pb-safe">
      {tabs.map((tab) => {
        if (tab.id === 'create') {
          return (
            <button 
              key={tab.id}
              onClick={onCreateClick}
              className="relative flex items-center justify-center w-[45px] h-[30px] active:scale-90 transition-transform"
            >
              <div className="absolute w-full h-full bg-white rounded-[8px] flex items-center justify-center">
                <div className="absolute -left-[2px] w-[15px] h-full bg-[#00f2ea] rounded-[8px] z-[-1]"></div>
                <div className="absolute -right-[2px] w-[15px] h-full bg-[#FE2C55] rounded-[8px] z-[-1]"></div>
                <i className="fa-solid fa-plus text-black text-sm"></i>
              </div>
            </button>
          );
        }

        const isActive = activeTab === tab.id;
        
        return (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)} 
            className="flex flex-col items-center justify-center flex-1 h-full active:scale-90 transition-transform"
          >
            <div className="relative">
               <i className={`fa-solid ${tab.icon} text-[22px] ${isActive ? 'text-white' : 'text-zinc-500'}`}></i>
               {tab.id === 'inbox' && (
                 <div className="absolute -top-1 -right-2 bg-[#FE2C55] text-[9px] font-bold px-1 rounded-full border border-black min-w-[14px]">
                   2
                 </div>
               )}
            </div>
            <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-white' : 'text-zinc-500'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
