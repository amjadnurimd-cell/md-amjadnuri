
import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import VideoCard from './components/VideoCard';
import CreateModal from './components/CreateModal';
import SearchScreen from './components/SearchScreen';
import FriendsScreen from './components/FriendsScreen';
import InboxScreen from './components/InboxScreen';
import Profile from './components/Profile';
import SettingsScreen from './components/SettingsScreen';
import { VideoContent } from './types';

const INITIAL_VIDEOS: VideoContent[] = [
  {
    id: 'v1',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lighting-in-the-city-21013-large.mp4',
    user: { id: 'u1', username: 'neon_vibes', avatar: 'https://picsum.photos/seed/u1/100/100', isFollowing: false },
    description: 'Neon nights in the city. #cyberpunk #neon #tokyo',
    tags: ['cyberpunk', 'neon', 'tokyo'],
    likes: 12400,
    comments: 850,
    shares: 1200,
    musicName: 'Original Sound - Night City'
  },
  {
    id: 'v2',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-a-shore-1188-large.mp4',
    user: { id: 'u2', username: 'nature_lofi', avatar: 'https://picsum.photos/seed/u2/100/100', isFollowing: true },
    description: 'Calm waves to start your day. 🌊 #ocean #calm #aesthetic',
    tags: ['ocean', 'calm', 'aesthetic'],
    likes: 8900,
    comments: 420,
    shares: 310,
    musicName: 'Nature Lo-Fi Beats'
  }
];

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [feedTab, setFeedTab] = useState<'for-you' | 'following'>('for-you');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [videos, setVideos] = useState<VideoContent[]>(INITIAL_VIDEOS);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoCreated = (newVideo: VideoContent) => {
    setVideos([newVideo, ...videos]);
    setIsCreateOpen(false);
    setActiveTab('home');
  };

  if (showSplash) return <SplashScreen />;

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex flex-col relative">
      {/* Screens */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'home' && (
          <>
            <TopNav 
              activeTab={feedTab} 
              setActiveTab={setFeedTab} 
              onSearch={() => setActiveTab('search')} 
            />
            <div className="video-container no-scrollbar">
              {videos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'search' && <SearchScreen />}
        {activeTab === 'friends' && <FriendsScreen />}
        {activeTab === 'inbox' && <InboxScreen />}
        
        {activeTab === 'profile' && (
          showSettings ? (
            <SettingsScreen onBack={() => setShowSettings(false)} />
          ) : (
            <Profile videos={videos} onOpenSettings={() => setShowSettings(true)} />
          )
        )}
      </div>

      {/* Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onCreateClick={() => setIsCreateOpen(true)} 
      />

      {/* Create Modal */}
      <CreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onVideoCreated={handleVideoCreated} 
      />
    </div>
  );
};

export default App;
