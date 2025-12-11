'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, MessageSquare, Send, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  // Use is required by Next.js 15, but since we disabled API calls, it will still work instantly.
  const { id } = use(params);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null);

  // --- MOCK DETAIL DATA ---
  const mockDetailData = {
    title: "Russia x Ukraine Ceasefire in 2025?",
    volume: "5,211,000",
    spread: "1.2%",
    buyYes: "32.0",
    sellYes: "30.8",
    capitalOdds: 32,
    // Static comments are preserved for the UI
    comments: [
        { user: '0x82...9a', text: 'This market is too volatile right now.', side: 'no' },
        { user: 'vitalik.eth', text: 'Peace is priced in at 32c.', side: 'yes' },
    ]
  };
  
  // Turn API calls OFF for design mode
  useEffect(() => {
    setData(mockDetailData);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );
  }

  // Calculate Sentiment (Simulated)
  const peopleVote = 42; 

  return (
    <main style={{ paddingBottom: '100px' }}>
      <Header />

      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5d6778', marginBottom: '20px', fontSize: '0.9rem', cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Back to Scanner
        </div>
      </Link>

      <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', lineHeight: '1.2' }}>
        {data.title}
      </h1>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        <span style={{ background: '#e0f2fe', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#0284c7' }}>
          VOL: ${data.volume}
        </span>
        <span style={{ background: '#f0fdf4', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#16a34a' }}>
          SPREAD: {data.spread}
        </span>
      </div>

      {/* --- REAL ORDER BOOK DATA --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#05b169', color: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '4px', fontWeight: '600' }}>BUY YES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{data.buyYes}¢</div>
        </div>
        <div style={{ background: '#df2020', color: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '4px', fontWeight: '600' }}>SELL YES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{data.sellYes}¢</div>
        </div>
      </div>

      {/* --- SENTIMENT BARS --- */}
      <div style={{ border: '1px solid #eef0f3', borderRadius: '16px', padding: '24px', marginBottom: '32px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#5d6778', letterSpacing: '1px', marginBottom: '20px', fontWeight: '700' }}>
          Market Discrepancy
        </h3>

        {/* Capital Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
            <span>Smart Money (Odds)</span>
            <span style={{ color: '#0052ff' }}>{data.capitalOdds}% Bullish</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: '#f0f0f0', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ width: `${data.capitalOdds}%`, height: '100%', background: '#0052ff' }}></div>
          </div>
        </div>

        {/* People Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
            <span>The People (Votes)</span>
            <span style={{ color: '#df2020' }}>{peopleVote}% Bearish</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: '#f0f0f0', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ width: `${peopleVote}%`, height: '100%', background: '#df2020' }}></div>
          </div>
        </div>
      </div>

      {/* --- VOTING --- */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          <button 
            onClick={() => setUserVote('yes')}
            style={{ 
              flex: 1, padding: '16px', borderRadius: '12px', 
              border: userVote === 'yes' ? '2px solid #05b169' : '1px solid #eef0f3', 
              background: userVote === 'yes' ? '#05b169' : 'white', 
              color: userVote === 'yes' ? 'white' : '#05b169', 
              fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s'
            }}>
            <ThumbsUp size={18} /> YES
          </button>
          
          <button 
            onClick={() => setUserVote('no')}
            style={{ 
              flex: 1, padding: '16px', borderRadius: '12px', 
              border: userVote === 'no' ? '2px solid #df2020' : '1px solid #eef0f3', 
              background: userVote === 'no' ? '#df2020' : 'white', 
              color: userVote === 'no' ? 'white' : '#df2020', 
              fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s'
            }}>
            <ThumbsDown size={18} /> NO
          </button>
      </div>

      {/* --- CHAT SECTION (Mockup preserved) --- */}
      <div>
        <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#5d6778', letterSpacing: '1px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} /> Discussion Thread (Mock)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '80px' }}>
            {/* Hardcoded Sample Comment */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: '#05b169', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 'bold'
              }}> Y </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#5d6778', marginBottom: '4px' }}>
                  vitalik.eth
                </div>
                <div style={{ background: '#f5f8ff', padding: '10px 14px', borderRadius: '0 12px 12px 12px', fontSize: '0.9rem' }}>
                  I see a clear entry point at 30c. Long term view.
                </div>
              </div>
            </div>
        </div>

        {/* Chat Input (Fixed Bottom) */}
        <div style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          background: 'white', borderTop: '1px solid #eef0f3', padding: '16px' 
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Add your analysis (Requires Wallet Connect)..." 
              style={{ flex: 1, padding: '12px 20px', borderRadius: '50px', border: '1px solid #eef0f3', background: '#f9fafb', outline: 'none' }} 
            />
            <button 
              style={{ background: '#0052ff', color: 'white', border: 'none', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}