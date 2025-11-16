import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export default function Scanner({ onScan }) {
  const { theme } = useTheme();
  const [scanConfig, setScanConfig] = useState({
    scanType: 'all',
    exchange: 'BINANCE',
    symbols: 'major',
    customSymbol: '',
    timeframes: ['15m', '1h', '4h']
  });
  const [allSymbols, setAllSymbols] = useState([]);
  const [loadingSymbols, setLoadingSymbols] = useState(false);

  // Borsa seçenekleri
  const exchanges = {
    'BINANCE': {
      name: 'Binance',
      color: 'bg-yellow-500/20 border-yellow-500',
      symbolSuffix: 'USDT'
    },
    'BYBIT': {
      name: 'ByBit',
      color: 'bg-blue-500/20 border-blue-500', 
      symbolSuffix: 'USDT'
    },
    'OKX': {
      name: 'OKX',
      color: 'bg-purple-500/20 border-purple-500',
      symbolSuffix: 'USDT'
    }
  };

  // Binance'den tüm USDT pair'lerini çek
  useEffect(() => {
    if (scanConfig.exchange === 'BINANCE') {
      fetchAllSymbols();
    } else {
      // Diğer borsalar için placeholder symbol listesi
      setAllSymbols(getDefaultSymbols(scanConfig.exchange));
    }
  }, [scanConfig.exchange]);

  const fetchAllSymbols = async () => {
    setLoadingSymbols(true);
    try {
      const response = await fetch('/api/symbols');
      const data = await response.json();
      if (data.success) {
        setAllSymbols(data.symbols);
      }
    } catch (error) {
      console.error('Symbols fetch error:', error);
      setAllSymbols(getDefaultSymbols('BINANCE'));
    } finally {
      setLoadingSymbols(false);
    }
  };

  const getDefaultSymbols = (exchange) => {
    const baseSymbols = ['BTC', 'ETH', 'BNB', 'ADA', 'XRP', 'DOT', 'LTC', 'LINK', 'BCH', 'EOS', 'XLM', 'ATOM', 'SOL', 'MATIC', 'AVAX'];
    return baseSymbols.map(symbol => `${symbol}${exchanges[exchange].symbolSuffix}`);
  };

  const symbolOptions = {
    major: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
    top15: getDefaultSymbols(scanConfig.exchange),
    all: allSymbols
  };

  const allTimeframes = ['5m', '15m', '30m', '1h', '4h', '1d', '1w'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let symbols = [];
    if (scanConfig.symbols === 'major') {
      symbols = symbolOptions.major;
    } else if (scanConfig.symbols === 'top15') {
      symbols = symbolOptions.top15;
    } else if (scanConfig.symbols === 'all') {
      symbols = symbolOptions.all;
    } else if (scanConfig.symbols === 'custom' && scanConfig.customSymbol) {
      symbols = [scanConfig.customSymbol.toUpperCase()];
    }
    
    if (symbols.length === 0) {
      alert('Lütfen geçerli bir sembol seçin');
      return;
    }

    if (scanConfig.timeframes.length === 0) {
      alert('Lütfen en az bir zaman dilimi seçin');
      return;
    }

    // Tüm coinler seçildiyse uyarı göster
    if (scanConfig.symbols === 'all' && symbols.length > 50) {
      if (!confirm(`⚠️ ${symbols.length} coin taranacak. Bu işlem biraz zaman alabilir. Devam etmek istiyor musunuz?`)) {
        return;
      }
    }

    onScan({
      ...scanConfig,
      symbols: symbols.slice(0, 100) // İlk 100 coin ile sınırla
    });
  };

  const toggleTimeframe = (tf) => {
    setScanConfig(prev => ({
      ...prev,
      timeframes: prev.timeframes.includes(tf)
        ? prev.timeframes.filter(t => t !== tf)
        : [...prev.timeframes, tf]
    }));
  };

  const selectAllTimeframes = () => {
    setScanConfig(prev => ({
      ...prev,
      timeframes: [...allTimeframes]
    }));
  };

  const clearAllTimeframes = () => {
    setScanConfig(prev => ({
      ...prev,
      timeframes: []
    }));
  };

  return (
    <div className="glass-effect rounded-xl p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exchange Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">
            🏦 Borsa Seçimi
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(exchanges).map(([key, exchange]) => (
              <button
                key={key}
                type="button"
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  scanConfig.exchange === key 
                    ? exchange.color 
                    : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => setScanConfig(prev => ({ ...prev, exchange: key }))}
              >
                <div className="font-medium">{exchange.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Scan Type */}
        <div>
          <label className="block text-sm font-medium mb-3">
            🔍 Tarama Türü
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'long', label: '🟢 LONG Sinyalleri', color: 'bg-green-500/20 border-green-500' },
              { value: 'short', label: '🔴 SHORT Sinyalleri', color: 'bg-red-500/20 border-red-500' },
              { value: 'all', label: '📊 Tüm Sinyaller', color: 'bg-blue-500/20 border-blue-500' }
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  scanConfig.scanType === type.value 
                    ? type.color 
                    : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => setScanConfig(prev => ({ ...prev, scanType: type.value }))}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Symbols */}
        <div>
          <label className="block text-sm font-medium mb-3">
            📊 {exchanges[scanConfig.exchange].name} Coin Seçimi {loadingSymbols && <span className="text-yellow-400">(yükleniyor...)</span>}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            {[
              { value: 'major', label: 'Major Coinler', count: symbolOptions.major.length },
              { value: 'top15', label: 'Top 15 Coin', count: symbolOptions.top15.length },
              { value: 'all', label: 'Tüm Coinler', count: symbolOptions.all.length, warning: true },
              { value: 'custom', label: 'Özel Coin', count: 1 }
            ].map((symbolType) => (
              <button
                key={symbolType.value}
                type="button"
                className={`p-3 rounded-lg border-2 text-center transition-all relative ${
                  scanConfig.symbols === symbolType.value 
                    ? 'bg-purple-500/20 border-purple-500' 
                    : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                } ${symbolType.warning ? 'ring-1 ring-yellow-400' : ''}`}
                onClick={() => setScanConfig(prev => ({ ...prev, symbols: symbolType.value }))}
                disabled={symbolType.value === 'all' && allSymbols.length === 0}
              >
                <div className="font-medium">{symbolType.label}</div>
                <div className="text-xs text-gray-400 mt-1">{symbolType.count} coin</div>
                {symbolType.warning && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          
          {scanConfig.symbols === 'custom' && (
            <input
              type="text"
              placeholder={`Örnek: BTC${exchanges[scanConfig.exchange].symbolSuffix}`}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={scanConfig.customSymbol}
              onChange={(e) => setScanConfig(prev => ({ ...prev, customSymbol: e.target.value }))}
            />
          )}

          {scanConfig.symbols === 'all' && (
            <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center text-yellow-400 text-sm">
                <span className="mr-2">⚠️</span>
                <span>
                  <strong>{symbolOptions.all.length} coin</strong> taranacak. 
                  Bu işlem birkaç dakika sürebilir.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Timeframes */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium">
              ⏰ Zaman Dilimleri
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllTimeframes}
                className="text-xs px-2 py-1 bg-blue-500/20 border border-blue-500 rounded hover:bg-blue-500/30"
              >
                Tümünü Seç
              </button>
              <button
                type="button"
                onClick={clearAllTimeframes}
                className="text-xs px-2 py-1 bg-red-500/20 border border-red-500 rounded hover:bg-red-500/30"
              >
                Temizle
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {allTimeframes.map((tf) => (
              <button
                key={tf}
                type="button"
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  scanConfig.timeframes.includes(tf)
                    ? 'bg-yellow-500/20 border-yellow-500'
                    : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => toggleTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Seçili: {scanConfig.timeframes.length} zaman dilimi
          </div>
        </div>

        {/* Scan Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={scanConfig.timeframes.length === 0 || (scanConfig.symbols === 'all' && allSymbols.length === 0)}
        >
          {scanConfig.symbols === 'all' ? (
            <>🚀 TÜM COINLERİ TARA ({symbolOptions.all.length})</>
          ) : (
            <>🚀 TARAMAYI BAŞLAT</>
          )}
        </button>

        {/* Progress Info */}
        {scanConfig.symbols === 'all' && (
          <div className="text-center text-sm text-gray-400">
            ⏳ Tahmini süre: ~{Math.ceil((symbolOptions.all.length * scanConfig.timeframes.length) / 10)} saniye
          </div>
        )}
      </form>
    </div>
  );
}