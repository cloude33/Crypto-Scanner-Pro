import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
    const symbols = response.data.symbols;
    
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

    return NextResponse.json({
      success: true,
      symbols: usdtPairs,
      total: usdtPairs.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Symbols fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Symbols fetch failed',
        message: error.message 
      },
      { status: 500 }
    );
  }
}