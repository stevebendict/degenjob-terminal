'use client';

import { Trophy, Medal, TrendingUp, User } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function LeaderboardPage() {
  // Mock Data: This will eventually come from Supabase
  const leaders = [
    { rank: 1, name: 'vitalik.eth', score: 98, streak: '🔥 12', accuracy: '92%' },
    { rank: 2, name: '0x4a...92', score: 85, streak: '🔥 8', accuracy: '88%' },
    { rank: 3, name: 'dgen_god.base', score: 72, streak: '4', accuracy: '75%' },
    { rank: 4, name: 'satoshi_fan', score: 65, streak: '2', accuracy: '60%' },
    { rank: 5, name: 'base_builder', score: 50, streak: '0', accuracy: '55%' },
  ];

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      <Header />

      <div style={{ padding: '0 16px' }}>
        
        {/* Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Trophy className="text-yellow-500" size={28} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Top Predictors</h1>
        </div>

        {/* User Stats Card (Your Personal Rank) */}
        <div style={{ 
          background: 'linear-gradient(135deg, #0052ff 0%, #0045c2 100%)', 
          borderRadius: '16px', padding: '20px', color: 'white', marginBottom: '32px',
          boxShadow: '0 8px 20px rgba(0, 82, 255, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
              <User size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>YOUR RANK</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>#420</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>ACCURACY</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>0%</div>
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Vote on active markets to climb the ranks.</span>
            <Link href="/" style={{ color: 'white', textDecoration: 'underline', fontWeight: 'bold' }}>Vote Now</Link>
          </div>
        </div>

        {/* Leaderboard List */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eef0f3', overflow: 'hidden' }}>
          {leaders.map((user) => (
            <div key={user.rank} style={{ 
              display: 'flex', alignItems: 'center', padding: '16px', 
              borderBottom: '1px solid #f5f8ff',
              background: user.rank <= 3 ? '#fafcff' : 'white'
            }}>
              {/* Rank Icon */}
              <div style={{ width: '40px', fontWeight: 'bold', color: '#5d6778', fontSize: '1.1rem' }}>
                {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
              </div>
              
              {/* User Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#5d6778', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Accuracy: <span style={{ color: '#05b169', fontWeight: 'bold' }}>{user.accuracy}</span>
                </div>
              </div>

              {/* Score Badge */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0052ff' }}>{user.score}</div>
                <div style={{ fontSize: '0.7rem', color: '#5d6778' }}>PTS</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}