import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // ------------------------------------------------------------------
    // 1. FETCH SUMMARY DATA (Gamma API)
    // ------------------------------------------------------------------
    // This gives us the list of "Events" (titles, volume, slugs)
    const polyRes = await fetch('https://gamma-api.polymarket.com/events?limit=20&active=true&closed=false');
    const polyData = polyRes.ok ? await polyRes.json() : [];

    // ------------------------------------------------------------------
    // 2. PROCESS & NORMALIZE
    // ------------------------------------------------------------------
    // We map the raw data into our clean format.
    const cleanPoly = await Promise.all(polyData.map(async (e: any, index: number) => {
      const market = e.markets?.[0]; // We focus on the primary market (e.g. Winner)
      
      // A. Extract Basic Price (Midpoint)
      let finalPrice = "0.00";
      if (market?.outcomePrices) {
        try {
          // Handle messy API formats (sometimes String, sometimes Array)
          const prices = typeof market.outcomePrices === 'string' 
            ? JSON.parse(market.outcomePrices) 
            : market.outcomePrices;
          
          const rawNum = parseFloat(prices[0]); // Usually the 'YES' price
          if (!isNaN(rawNum)) finalPrice = (rawNum * 100).toFixed(1);
        } catch (err) { /* Ignore parsing errors */ }
      }

      // B. Extract the CLOB Token ID (Crucial for Order Book)
      // This ID allows us to look up the deep "Buy/Sell" walls later
      const yesTokenId = market?.clobTokenIds?.[0];

      // C. DEEP DIVE (Proof of Concept)
      // For the #1 Market only (to keep the scanner fast), we fetch the REAL Order Book.
      let orderBookDetails = null;
      if (index === 0 && yesTokenId) {
        try {
          const bookRes = await fetch(`https://clob.polymarket.com/book?token_id=${yesTokenId}`);
          if (bookRes.ok) {
            const book = await bookRes.json();
            // Get the best prices (Highest Bid, Lowest Ask)
            const bestBuyYes = book.bids?.[0]?.price || "0";
            const bestSellYes = book.asks?.[0]?.price || "0";
            
            orderBookDetails = {
              bid: (parseFloat(bestBuyYes) * 100).toFixed(1), // "Buy" Wall
              ask: (parseFloat(bestSellYes) * 100).toFixed(1), // "Sell" Wall
              spread: ((parseFloat(bestSellYes) - parseFloat(bestBuyYes)) * 100).toFixed(2) + "%"
            };
            console.log(`Deep Scan Success for ${e.title}:`, orderBookDetails);
          }
        } catch (err) {
          console.error("CLOB Fetch Failed");
        }
      }

      return {
        id: e.id,
        title: e.title,
        price: finalPrice, // The simple price for the list view
        deepBook: orderBookDetails, // The complex data (only for top item)
        vol: Math.floor(Number(e.volume || 0)).toLocaleString(),
        url: `https://polymarket.com/event/${e.slug}`,
        source: 'Polymarket'
      };
    }));

    // Sort by Volume
    cleanPoly.sort((a: any, b: any) => 
      parseFloat(b.vol.replace(/,/g, '')) - parseFloat(a.vol.replace(/,/g, ''))
    );

    // ------------------------------------------------------------------
    // 3. KALSHI FALLBACK (Smart Dummy Data)
    // ------------------------------------------------------------------
    // Until your teammate logs in, we use this clean data to keep the UI nice.
    const cleanKalshi = [
      { id: 'k1', title: 'Bitcoin > $100k (Kalshi)', price: '62.5', vol: '1,200,000', url: '#' },
      { id: 'k2', title: 'Fed Rate Cut (Kalshi)', price: '28.0', vol: '450,000', url: '#' },
      { id: 'k3', title: 'US Recession 2025', price: '15.5', vol: '890,000', url: '#' },
    ];

    return NextResponse.json({
      polymarket: cleanPoly,
      kalshi: cleanKalshi
    });

  } catch (error) {
    console.error("Scanner Error:", error);
    return NextResponse.json({ error: "Scanner Offline" }, { status: 500 });
  }
}