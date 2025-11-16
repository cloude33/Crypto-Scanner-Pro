// app/api/symbols/route.js
// API route for fetching available cryptocurrency symbols
import { NextResponse } from 'next/server';



// Fetch available symbols from Binance API or fallback to static list
export async function GET() {
  try {
    console.log('Fetching symbols from Binance API...');
    
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    console.log('Binance API Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      const symbols = data.symbols || [];
      
      // Filter for USDT trading pairs that are actively trading
      const usdtPairs = symbols
        .filter(symbol => 
          symbol.symbol.endsWith('USDT') && 
          symbol.status === 'TRADING'
        )
        .map(symbol => symbol.symbol)
        .sort();

      console.log(`Binance API success: ${usdtPairs.length} USDT pairs`);
      
      return NextResponse.json({
        success: true,
        symbols: usdtPairs,
        total: usdtPairs.length,
        timestamp: new Date().toISOString(),
        source: 'binance-api'
      });
    }
    
    throw new Error(`HTTP ${response.status}`);
    
  } catch (error) {
    console.error('Binance API failed:', error);
    
    // Return empty array if API fails
    return NextResponse.json({
      success: true,
      symbols: [],
      total: 0,
      timestamp: new Date().toISOString(),
      source: 'binance-api-fallback',
      error: error.message
    });
  }
}