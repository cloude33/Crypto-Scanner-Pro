// app/api/symbols/route.js
import { NextResponse } from 'next/server';

// Gerçek Binance coin listesi (web'den bulduğun)
const REAL_BINANCE_COINS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 
  'XRPUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'LINKUSDT',
  'LTCUSDT', 'BCHUSDT', 'ATOMUSDT', 'XLMUSDT', 'ETCUSDT',
  'FILUSDT', 'THETAUSDT', 'VETUSDT', 'TRXUSDT', 'EOSUSDT',
  'AAVEUSDT', 'ALGOUSDT', 'MKRUSDT', 'XTZUSDT', 'DAIUSDT',
  'COMPUSDT', 'YFIUSDT', 'SUSHIUSDT', 'SNXUSDT', 'BATUSDT',
  'ZECUSDT', 'DASHUSDT', 'ENJUSDT', 'MANAUSDT', 'GALAUSDT',
  'SANDUSDT', 'APEUSDT', 'GMTUSDT', 'NEARUSDT', 'FTMUSDT',
  'GRTUSDT', 'CRVUSDT', '1INCHUSDT', 'RENUSDT', 'CELRUSDT',
  'MATICUSDT', 'ANKRUSDT', 'IOSTUSDT', 'IOTAUSDT', 'ONTUSDT',
  'QTUMUSDT', 'VITEUSDT', 'WAVESUSDT', 'ZILUSDT', 'RVNUSDT',
  'SCUSDT', 'STORJUSDT', 'KAVAUSDT', 'RUNEUSDT', 'OCEANUSDT',
  'BELUSDT', 'CTSIUSDT', 'LITUSDT', 'REEFUSDT', 'COTIUSDT',
  'CHRUSDT', 'ALPHAUSDT', 'SKLUSDT', 'STMXUSDT', 'DODOUSDT',
  'TRBUSDT', 'PONDUSDT', 'DGBUSDT', '1000SHIBUSDT', 'BANDUSDT',
  'NKNUSDT', 'OXTUSDT', 'SXPUSDT', 'KSMUSDT', 'EGLDUSDT',
  'ZRXUSDT', 'ICXUSDT', 'RSRUSDT', 'ARPAUSDT', 'DATAUSDT',
  'OMGUSDT', 'TOMOUSDT', 'PERPUSDT', 'TWTUSDT', 'FIROUSDT',
  'BTCSTUSDT', 'CKBUSDT', 'TRUUSDT', 'LINAUSDT', 'MBLUSDT',
  'MDTUSDT', 'VTHOUSDT', 'AKROUSDT', 'WRXUSDT', 'SLPUSDT',
  'DENTUSDT', 'CELOUSDT', 'HOTUSDT', 'MTLUSDT', 'OGNUSDT',
  'NMRUSDT', 'POLSUSDT', 'FORTHUSDT', 'BETAUSDT', 'SHIBUSDT',
  'ARUSDT', 'RAYUSDT', 'FARMUSDT', 'QUICKUSDT', 'MBOXUSDT',
  'INJUSDT', 'PROMUSDT', 'QNTUSDT', 'CFXUSDT', 'FXSUSDT',
  'DYDXUSDT', 'GTCUSDT', 'JASMYUSDT', 'ACHUSDT', 'IMXUSDT',
  'RNDRUSDT', 'ENSUSDT', 'PEOPLEUSDT', 'ANTUSDT', 'ROSEUSDT',
  'DARUSDT', 'RAREUSDT', 'ADXUSDT', 'AUCTIONUSDT', 'BICOUSDT',
  'FLOWUSDT', 'GALUSDT', 'HFTUSDT', 'HOOKUSDT', 'ILVUSDT',
  'AGIXUSDT', 'NEXOUSDT', 'STGUSDT', 'TVKUSDT', 'API3USDT',
  'BLZUSDT', 'C98USDT', 'CTKUSDT', 'CVXUSDT', 'IDEXUSDT',
  'LDOUSDT', 'LEVERUSDT', 'LQTYUSDT', 'METISUSDT', 'MINAUSDT',
  'PENDLEUSDT', 'PEPEUSDT', 'RADUSDT', 'RLCUSDT', 'STXUSDT',
  'TUSDT', 'UMAUSDT', 'UNFIUSDT', 'WOOUSDT', 'YGGUSDT', 'ZENUSDT'
  // ... senin bulduğun diğer 300+ coin buraya ekle
].sort();

export async function GET() {
  try {
    console.log('Trying Binance API...');
    
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
      
      // DAHA AZ STRICT FİLTRELEME
      const usdtPairs = symbols
        .filter(symbol => 
          symbol.symbol.endsWith('USDT') && 
          symbol.status === 'TRADING'
          // UP/DOWN/BULL/BEAR filtrelerini kaldır veya gevşet
        )
        .map(symbol => symbol.symbol)
        .sort();

      console.log(`Binance API success: ${usdtPairs.length} pairs`);
      
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
    console.error('Binance API failed, using real coin list:', error);
    
    // Web'den bulduğun gerçek listeyi kullan
    return NextResponse.json({
      success: true,
      symbols: REAL_BINANCE_COINS,
      total: REAL_BINANCE_COINS.length,
      timestamp: new Date().toISOString(),
      source: 'real-fallback-list',
      error: error.message
    });
  }
}