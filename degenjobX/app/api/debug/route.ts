import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch RAW Polymarket (Just 3 events to keep it readable)
    const polyRes = await fetch('https://gamma-api.polymarket.com/events?limit=3&active=true&closed=false');
    const polyRaw = await polyRes.json();

    // 2. Fetch RAW Kalshi
    const kalshiRes = await fetch('https://trading-api.kalshi.com/trade-api/v2/markets?limit=3&status=active');
    // Kalshi sometimes returns text if there's an error, so we handle that:
    let kalshiRaw;
    try {
      kalshiRaw = await kalshiRes.json();
    } catch (e) {
      kalshiRaw = { error: "Could not parse JSON", status: kalshiRes.status, text: await kalshiRes.text() };
    }

    return NextResponse.json({
      POLYMARKET_RAW_SAMPLE: polyRaw[0], // We only need to see ONE event structure
      KALSHI_RAW_SAMPLE: kalshiRaw
    });

  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}