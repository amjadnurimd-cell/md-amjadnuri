
import React, { useState, useEffect } from 'react';
import { searchGrounding } from '../services/geminiService';

const SUGGESTED_TOPICS = [
  { icon: 'fa-bolt', text: 'Latest tech breakthroughs' },
  { icon: 'fa-trophy', text: 'Sports highlights today' },
  { icon: 'fa-music', text: 'Trending songs on TikTok' },
  { icon: 'fa-newspaper', text: 'World news summary' }
];

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string, sources: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');

  const loadingStages = [
    'Accessing web knowledge...',
    'Consulting Google Search...',
    'Verifying facts...',
    'Synthesizing AI insight...'
  ];

  useEffect(() => {
    let interval: number;
    if (loading) {
      let stage = 0;
      setLoadingStage(loadingStages[0]);
      interval = window.setInterval(() => {
        stage = (stage + 1) % loadingStages.length;
        setLoadingStage(loadingStages[stage]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const activeQuery = customQuery || query;
    if (!activeQuery.trim()) return;
    
    setQuery(activeQuery);
    setLoading(true);
    setResult(null);
    
    try {
      const data = await searchGrounding(activeQuery);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-black text-white p-6 pt-16 overflow-y-auto no-scrollbar pb-24 h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Discovery</h1>
        <p className="text-zinc-500 text-sm">Explore the world with Gemini AI</p>
      </header>

      <form onSubmit={handleSearch} className="relative flex items-center mb-8 group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FE2C55]/20 to-[#00f2ea]/20 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        <i className="fa-solid fa-magnifying-glass absolute left-4 text-zinc-500 z-10"></i>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything about recent events..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE2C55] relative z-10 transition-all placeholder:text-zinc-600"
        />
        <button type="submit" className="hidden">Search</button>
      </form>

      {loading ? (
        <div className="flex flex-col items-center py-20 space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-t-[#00f2ea] border-zinc-800 rounded-full animate-spin"></div>
            <i className="fa-solid fa-earth-americas absolute inset-0 flex items-center justify-center text-[#00f2ea] animate-pulse"></i>
          </div>
          <div className="text-center space-y-2">
            <p className="text-white font-bold text-lg">{loadingStage}</p>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">AI Grounding in progress</p>
          </div>
        </div>
      ) : result ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main AI Response */}
          <div className="relative p-[1px] rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ea]/40 via-purple-500/20 to-[#FE2C55]/40 animate-gradient-xy"></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-xl p-6 rounded-[23px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-[#00f2ea] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Gemini Insight</div>
                  <span className="text-[10px] text-zinc-500 flex items-center">
                    <i className="fa-solid fa-circle-check text-blue-400 mr-1 text-[8px]"></i>
                    Verified by Google Search
                  </span>
                </div>
              </div>
              <div className="text-zinc-200 leading-relaxed text-sm space-y-4 prose prose-invert max-w-none">
                {result.text.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('-') ? 'pl-4' : ''}>
                    {line.startsWith('-') ? line.replace('-', '•') : line}
                  </p>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sources Section */}
          {result.sources.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Web References</h3>
                <span className="text-[10px] text-zinc-600">{result.sources.length} sources found</span>
              </div>
              <div className="flex overflow-x-auto no-scrollbar space-x-3 pb-2 -mx-2 px-2">
                {result.sources.map((source, i) => (
                  <a 
                    key={i}
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center space-x-3 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 hover:border-zinc-700 transition-all group max-w-[240px]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-[#FE2C55]/20 group-hover:text-[#FE2C55] transition-colors">
                      <i className="fa-solid fa-link text-xs"></i>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold text-zinc-300 truncate group-hover:text-white">{source.title}</p>
                      <p className="text-[9px] text-zinc-600 truncate">{new URL(source.uri).hostname}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => { setResult(null); setQuery(''); }}
            className="w-full py-4 rounded-2xl border border-zinc-800 text-zinc-500 text-sm font-bold hover:bg-zinc-900 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in duration-700">
          <section>
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 px-2">Trending AI Searches</h3>
            <div className="grid grid-cols-1 gap-3">
              {SUGGESTED_TOPICS.map((topic, i) => (
                <button 
                  key={i}
                  onClick={() => handleSearch(undefined, topic.text)}
                  className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-[#FE2C55] group-hover:text-white transition-all">
                      <i className={`fa-solid ${topic.icon}`}></i>
                    </div>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white">{topic.text}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-zinc-700 group-hover:translate-x-1 transition-transform"></i>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 px-2">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['#AI', '#Future', '#Tech', '#News', '#Space', '#Robotics', '#Web3'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => handleSearch(undefined, `Tell me about ${tag.replace('#', '')} trends`)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SearchScreen;
