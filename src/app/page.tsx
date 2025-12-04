'use client';

import { useState } from 'react';
import { Search, Home, Plus, Menu, X, MessageSquare, Moon, Sun, Globe, Sparkles, Send } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'home' | 'search'>('home');
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [messages, setMessages] = useState<Array<{role: string; content: string; sources?: any[]}>>([]);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);

  const chatHistory = [
    { id: 1, title: 'New Cairo apartments', timestamp: '2h ago' },
    { id: 2, title: 'Luxury villas', timestamp: 'Yesterday' },
    { id: 3, title: 'Properties near schools', timestamp: '2d ago' },
  ];

  const suggestions = [
    '3BR New Cairo <5M',
    'Villas 6th October',
    'Penthouses New Capital',
    'Properties near schools'
  ];

  const sampleProperties = [
    { id: 1, name: 'Skyline Residence', location: 'New Cairo', developer: 'Emaar', price: '4.2M', rating: 4.6, beds: 3, baths: 2, size: 180, x: 30, y: 40 },
    { id: 2, name: 'Eden Villa', location: '6th October', developer: 'Sodic', price: '8.5M', rating: 4.3, beds: 4, baths: 3, size: 350, x: 50, y: 50 },
    { id: 3, name: 'Capital Heights', location: 'New Capital', developer: 'TMG', price: '12M', rating: 4.2, beds: 4, baths: 4, size: 280, x: 70, y: 35 },
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: searchQuery }]);
    setCurrentView('search');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'There are many properties available across Cairo. In New Cairo alone there are around 500+ active listings with average prices around 4-8M EGP for 3-bedroom apartments. Major developers include Emaar, Sodic, and Hyde Park.',
        sources: sampleProperties
      }]);
    }, 1500);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentView('home');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? '260px' : '56px',
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="fixed left-0 top-0 h-screen bg-[hsl(var(--sidebar-bg))] border-r border-border z-50 flex flex-col overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center justify-between min-h-[57px]">
          {sidebarOpen ? (
            <>
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                  <Home size={16} className="text-primary-foreground" strokeWidth={2.5} />
                </div>
                <span className="text-lg font-normal tracking-tight">tent</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-secondary rounded-md transition-colors">
                <X size={20} className="text-muted-foreground" strokeWidth={1.5} />
              </button>
            </>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-secondary rounded-md transition-colors mx-auto">
              <Menu size={20} className="text-muted-foreground" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {sidebarOpen && (
          <>
            <div className="p-4">
              <button
                onClick={startNewChat}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={18} strokeWidth={2} />
                <span className="text-sm">New Thread</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Recent
              </div>
              {chatHistory.map(chat => (
                <button
                  key={chat.id}
                  className="w-full p-3 mb-1 rounded-lg hover:bg-secondary/50 transition-colors text-left flex items-center gap-2.5"
                >
                  <MessageSquare size={16} className="text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-normal text-foreground truncate">{chat.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{chat.timestamp}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-border flex gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex-1 p-2.5 border border-border rounded-lg hover:bg-secondary transition-colors flex items-center justify-center"
              >
                {darkMode ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
              </button>
              <button className="flex-1 p-2.5 border border-border rounded-lg hover:bg-secondary transition-colors flex items-center justify-center">
                <Globe size={16} strokeWidth={1.5} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarOpen ? '260px' : '56px',
          transition: 'margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="min-h-screen bg-background"
      >
        {currentView === 'home' ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <h1 className="text-5xl font-light tracking-tight text-foreground mb-12">tent</h1>

            <div className="w-full max-w-3xl mb-6">
              <div className="flex items-center bg-input border border-border rounded-xl p-3.5 hover:border-muted-foreground transition-colors">
                <Search size={20} className="text-muted-foreground mr-3 flex-shrink-0" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Ask anything about properties..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                  className="flex-1 bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => query && handleSearch(query)}
                  disabled={!query}
                  className="ml-2 p-2 bg-primary hover:bg-primary/90 disabled:bg-secondary disabled:opacity-50 rounded-lg transition-all flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  <Sparkles size={18} className="text-primary-foreground" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(suggestion)}
                  className="px-4 py-2 bg-secondary border border-border rounded-full text-sm text-muted-foreground hover:bg-muted hover:border-muted-foreground transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="mt-12">
              <Link
                href="/login"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Sign in to save your searches
              </Link>
            </div>
          </div>
        ) : (
          <div className="h-screen flex">
            <div className="flex-1 bg-[#1a1a1a] relative">
              <div
                className="w-full h-full relative"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }}
              >
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-semibold text-white/70">
                  mapbox
                </div>

                {sampleProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onMouseEnter={() => setHoveredPin(prop.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                    className="absolute cursor-pointer"
                    style={{ left: `${prop.x}%`, top: `${prop.y}%`, zIndex: hoveredPin === prop.id ? 100 : 1 }}
                  >
                    <div
                      className="bg-primary text-primary-foreground px-3 py-2 rounded-full text-sm font-bold shadow-lg transition-transform"
                      style={{
                        transform: hoveredPin === prop.id ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {prop.rating}
                    </div>
                    <div
                      className="mx-auto"
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '8px solid hsl(var(--primary))',
                        position: 'relative',
                        left: '50%',
                        transform: 'translateX(-50%)'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-background">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-normal tracking-tight">Properties in Cairo</h2>
                <button
                  onClick={startNewChat}
                  className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Plus size={16} strokeWidth={1.5} />
                  <span>New</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-full space-y-6">
                  {messages.map((message, idx) => (
                    <div key={idx}>
                      {message.role === 'user' ? (
                        <div className="bg-secondary border border-border rounded-lg p-4">
                          <p className="text-foreground text-[15px] leading-relaxed">{message.content}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="bg-secondary border border-border rounded-lg p-5 mb-4">
                            <p className="text-foreground text-[15px] leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>

                          {message.sources && message.sources.length > 0 && (
                            <div className="space-y-3">
                              <div className="text-sm font-semibold text-muted-foreground">Sample properties</div>
                              {message.sources.map((prop: any) => (
                                <div
                                  key={prop.id}
                                  className="bg-secondary border border-border rounded-lg overflow-hidden hover:border-primary transition-all cursor-pointer flex"
                                >
                                  <div className="w-36 h-24 bg-input flex-shrink-0 flex items-center justify-center text-4xl">
                                    🏢
                                  </div>
                                  <div className="p-3.5 flex-1">
                                    <div className="flex items-start justify-between mb-1.5">
                                      <h3 className="font-semibold text-[15px]">{prop.name}</h3>
                                      <div className="flex items-center gap-1 text-sm font-semibold">
                                        ⭐ {prop.rating}
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground mb-2">
                                      {prop.location} • {prop.developer}
                                    </div>
                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                      <span>{prop.beds}BR</span>
                                      <span>•</span>
                                      <span>{prop.baths}BA</span>
                                      <span>•</span>
                                      <span>{prop.size}m²</span>
                                      <span>•</span>
                                      <span className="text-primary font-semibold">{prop.price} EGP</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-border">
                <div className="flex items-center bg-input border border-border rounded-xl p-3">
                  <input
                    type="text"
                    placeholder="Ask a follow-up"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                    className="flex-1 bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => query && handleSearch(query)}
                    disabled={!query}
                    className="ml-2 p-2 text-primary disabled:text-muted-foreground disabled:opacity-50"
                  >
                    <Send size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
