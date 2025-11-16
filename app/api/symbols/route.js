// app/api/symbols/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching Binance symbols from Vercel...');
    
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CryptoScanner/1.0)'
      }
    });
    
    console.log('Binance API Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const symbols = data.symbols || [];
    
    // Sadece USDT pair'lerini ve aktif olanları filtrele
    const usdtPairs = symbols
      .filter(symbol => 
        symbol.symbol.endsWith('USDT') && 
        symbol.status === 'TRADING' &&
        !symbol.symbol.includes('UP') &&
        !symbol.symbol.includes('DOWN') &&
        !symbol.symbol.includes('BULL') &&
        !symbol.symbol.includes('BEAR')
      )
      .map(symbol => symbol.symbol)
      .sort();

    console.log(`Successfully filtered ${usdtPairs.length} USDT pairs`);
    
    return NextResponse.json({
      success: true,
      symbols: usdtPairs,
      total: usdtPairs.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Symbols fetch error:', error);
    
    // Fallback data - 15 majör coin
    const fallbackSymbols = [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 
      'DOTUSDT', 'LINKUSDT', 'LTCUSDT', 'BCHUSDT', 'XLMUSDT',
      'ATOMUSDT', 'ETCUSDT', 'VETUSDT', 'THETAUSDT', 'FILUSDT'
    ].sort();
    
    return NextResponse.json({
      success: true,
      symbols: fallbackSymbols,
      total: fallbackSymbols.length,
      timestamp: new Date().toISOString(),
      fallback: true,
      error: error.message
    });
  }
}