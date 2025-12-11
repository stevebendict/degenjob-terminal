import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

  try {
    // 1. Fetch Event Details to get the Token ID
    const eventRes = await fetch(`https://gamma-api.polymarket.com/events/${id}`);
    const eventData = await eventRes.json();
    
    // Safety Check
    if (!eventData || !eventData.markets) {
        return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    const market = eventData.markets[0];
    const yesTokenId = market.clobTokenIds?.[0]; // The ID for "YES"

    // 2. Fetch the ORDER BOOK (The Real Degen Data)
    let orderBook = { bid: "0.00", ask: "0.00", spread: "0%" };
    
    if (yesTokenId) {
        const bookRes = await fetch(`https://clob.polymarket.com/book?token_id=${yesTokenId}`);
        const bookData = await bookRes.json();

        // "Bids" = Buy Orders (Highest price someone pays)
        // "Asks" = Sell Orders (Lowest price someone sells)
        const bestBid = bookData.bids?.[0]?.price || 0;
        const bestAsk = bookData.asks?.[0]?.price || 0;

        if (bestBid > 0) {
            orderBook = {
                bid: (parseFloat(bestBid) * 100).toFixed(1),
                ask: (parseFloat(bestAsk) * 100).toFixed(1),
                spread: ((parseFloat(bestAsk) - parseFloat(bestBid)) * 100).toFixed(2) + "%"
            };
        }
    }

    // 3. Return Clean Data
    return NextResponse.json({
        title: eventData.title,
        volume: Math.floor(Number(eventData.volume || 0)).toLocaleString(),
        image: eventData.image,
        // The Data You Wanted:
        buyYes: orderBook.ask, // To Buy, you take the Ask
        sellYes: orderBook.bid, // To Sell, you hit the Bid
        spread: orderBook.spread,
        // Odds for the "Money Bar"
        capitalOdds: parseFloat(orderBook.ask) || 50,
    });

  } catch (error) {
    return NextResponse.json({ error: "Fetch Failed" }, { status: 500 });
  }
}