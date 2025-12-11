'use client';

import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect, 
} from '@coinbase/onchainkit/wallet'; 
import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import Link from 'next/link'; // Import Link

export default function Header() {
  return (
    <div className="header" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '16px'}}>
      
      {/* Top Row: Brand & Wallet */}
      <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Link href="/" style={{textDecoration: 'none'}}>
          <div className="brand" style={{cursor: 'pointer'}}>
            <span style={{color: 'black'}}>Degen</span><span style={{color: '#0052ff'}}>Job</span>
          </div>
        </Link>
        
        <Wallet>
          <ConnectWallet className="bg-[#0052ff] hover:bg-[#0045c2] text-white rounded-full px-4 py-2 font-semibold transition-all">
            <Avatar className="h-6 w-6 mr-2" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>

      {/* Navigation Row */}
      <nav style={{display: 'flex', gap: '20px', fontSize: '0.9rem', fontWeight: '600'}}>
        <Link href="/" className="nav-link" style={{color: '#050f19'}}>
          Scanner
        </Link>
        <Link href="/leaderboard" className="nav-link" style={{color: '#5d6778'}}>
          Leaderboard
        </Link>
      </nav>

    </div>
  );
}