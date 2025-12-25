
import React from 'react';

interface TopNavProps {
  activeTab: 'for-you' | 'following';
  setActiveTab: (tab: 'for-you' | 'following') => void;
  onSearch: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ activeTab, setActiveTab, onSearch }) => {
  return (
    <div className="absolute top-0 w-full flex items-center justify-center pt-8 pb-4 z-50 pointer-events-none">
      <div className="flex items-center space-x-4 pointer-events-auto">
        <button 
          onClick={() => setActiveTab('following')}
          className={`text-base font-bold transition-colors ${activeTab === 'following' ? 'text-white border-b-2 border-white' : 'text-white/60'}`}
        >
          Following
        </button>
        <div className="w-[1px] h-3 bg-white/30"></div>
        <button 
          onClick={() => setActiveTab('for-you')}
          className={`text-base font-bold transition-colors ${activeTab === 'for-you' ? 'text-white border-b-2 border-white' : 'text-white/60'}`}
        >
          For You
        </button>
      </div>
      <button 
        onClick={onSearch}
        className="absolute right-6 top-8 pointer-events-auto flex items-center justify-center w-10 h-10"
      >
        <i className="fa-solid fa-magnifying-glass text-white text-xl"></i>
      </button>
      <div className="absolute left-6 top-8 pointer-events-auto">
        <i className="fa-solid fa-tv text-white text-xl"></i>
      </div>
    </div>
  );
};

export default TopNav;
