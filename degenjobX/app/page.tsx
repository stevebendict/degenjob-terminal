'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header'; 

export default function Page() {
  const [activeTab, setActiveTab] = useState<'polymarket' | 'kalshi'>('polymarket');
  const [loading, setLoading] = useState(false); // Set to false since we aren't fetching
  const [data, setData] = useState({ polymarket: [], kalshi: [] });

  // --- STATIC DESIGN DATA (FAST UI MODE) ---
  const mockScannerData = {
    polymarket: [
      { id: '16108', title: 'Russia x Ukraine Ceasefire in 2025?', price: '32.0', vol: '5,211,000' },
      { id: '16096', title: 'Bitcoin > $100k by 2025?', price: '65.5', vol: '9,993,000' },
      { id: '16097', title: 'Ethereum ATH 2025?', price: '45.0', vol: '5,197,000' },
      { id: '16087', title: 'Largest Company end of 2025?', price: '72.0', vol: '5,187,000' },
      { id: '16105', title: 'Khamenei out as Supreme Leader of Iran in 2025?', price: '12.0', vol: '1,000,000' },
    ],
    kalshi: [
      { id: 'k1', title: 'Bitcoin > $100k (Kalshi)', price: '62.5', vol: '1,200,000' },
      { id: 'k2', title: 'Fed Rate Cut Dec (Kalshi)', price: '28.0', vol: '450,000' },
      { id: 'k3', title: 'US Recession 2025', price: '15.5', vol: '890,000' },
    ]
  };

  // Turn API calls OFF for design mode
  useEffect(() => {
    setData(mockScannerData);
  }, []);

  const currentData = activeTab === 'polymarket' ? data.polymarket : data.kalshi;

  return (
    <main>
      
      <Header />

      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'polymarket' ? 'active' : ''}`}
          onClick={() => setActiveTab('polymarket')}
        >
          Polymarket
        </div>
        <div 
          className={`tab ${activeTab === 'kalshi' ? 'active' : ''}`}
          onClick={() => setActiveTab('kalshi')}
        >
          Kalshi (US)
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 style={{fontSize: '0.8rem', color: '#5d6778', letterSpacing: '1px', textTransform: 'uppercase'}}>
            Top Opportunities
          </h3>
          <button 
            onClick={() => { /* In Design Mode, this does nothing */ }} 
            className="text-xs flex items-center gap-1 text-blue-600 font-bold hover:underline"
          >
            <RefreshCcw size={12} className={loading ? "animate-spin" : ""} />
            REFRESH
          </button>
        </div>
        
        {currentData.length === 0 && (
          <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
            No Active Markets Found
          </div>
        )}

        {currentData.map((item: any) => (
          <Link href={`/market/${item.id}`} key={item.id} style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="market-card hover:shadow-md transition-shadow">
              <div>
                <div className="market-title">{item.title}</div>
                <div className="market-sub">Vol: ${item.vol}</div>
              </div>
              <div>
                <div className="price-tag">{item.price}¢</div>
                <div className="live-tag">Vote</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Smart Alert Banner */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '20px', right: '20px', background: '#050f19', color: 'white', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 50
      }}>
        <div>
          <div style={{fontSize: '0.75rem', opacity: 0.7}}>Smart Alert</div>
          <div style={{fontWeight: '700', fontSize: '0.95rem'}}>3% Spread on ETH {'>'} $4k</div>
        </div>
        <div style={{
          background: '#0052ff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <ArrowRight size={18} />
        </div>
      </div>

    </main>
  );
}