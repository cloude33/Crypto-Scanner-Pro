// Results component for displaying scan results with filtering capabilities
import { useState } from 'react';

export default function Results({ data }) {
  const [filters, setFilters] = useState({
    signalType: 'all',
    timeframe: 'all'
  });

  const allTimeframes = ['5m', '15m', '30m', '1h', '4h', '1d', '1w'];
  const uniqueTimeframes = [...new Set(data.results.map(r => r.timeframe))].sort();

  // TradingView timeframe mapping
  const tradingViewTimeframes = {
    '5m': '5',
    '15m': '15', 
    '30m': '30',
    '1h': '60',
    '4h': '240',
    '1d': '1D',
    '1w': '1W'
  };

  // Generate TradingView link for a symbol and timeframe
  const getTradingViewLink = (symbol, timeframe) => {
    const tvTimeframe = tradingViewTimeframes[timeframe] || '60';
    return `https://www.tradingview.com/chart/?symbol=BINANCE:${symbol}&interval=${tvTimeframe}`;
  };

  // Filter results based on selected signal type and timeframe
  const filteredResults = data.results.filter(result => {
    // Sinyal tipi filtresi
    if (filters.signalType === 'long' && !result.final_signal.includes('LONG')) return false;
    if (filters.signalType === 'short' && !result.final_signal.includes('SHORT')) return false;
    
    // Zaman dilimi filtresi
    if (filters.timeframe !== 'all' && result.timeframe !== filters.timeframe) return false;
    
    return true;
  });

  const signalStats = {
    strong_long: data.results.filter(r => r.final_signal === 'STRONG_LONG').length,
    long: data.results.filter(r => r.final_signal === 'LONG').length,
    weak_long: data.results.filter(r => r.final_signal === 'WEAK_LONG').length,
    strong_short: data.results.filter(r => r.final_signal === 'STRONG_SHORT').length,
    short: data.results.filter(r => r.final_signal === 'SHORT').length,
    weak_short: data.results.filter(r => r.final_signal === 'WEAK_SHORT').length,
  };

  const timeframeStats = {};
  allTimeframes.forEach(tf => {
    timeframeStats[tf] = data.results.filter(r => r.timeframe === tf).length;
  });

  // Get CSS class for signal color based on signal type
  const getSignalColor = (signal) => {
    if (signal.includes('STRONG_LONG')) return 'signal-strong-long';
    if (signal.includes('LONG')) return 'signal-long';
    if (signal.includes('WEAK_LONG')) return 'signal-weak-long';
    if (signal.includes('STRONG_SHORT')) return 'signal-strong-short';
    if (signal.includes('SHORT')) return 'signal-short';
    if (signal.includes('WEAK_SHORT')) return 'signal-weak-short';
    return 'signal-neutral';
  };

  // Get icon for signal type
  const getSignalIcon = (signal) => {
    if (signal.includes('STRONG_LONG')) return '🟢';
    if (signal.includes('LONG')) return '🟡';
    if (signal.includes('WEAK_LONG')) return '⚪';
    if (signal.includes('STRONG_SHORT')) return '🔴';
    if (signal.includes('SHORT')) return '🟠';
    if (signal.includes('WEAK_SHORT')) return '⚫';
    return '➡️';
  };

  // Get CSS class for timeframe color
  const getTimeframeColor = (tf) => {
    const colors = {
      '5m': 'timeframe-5m',
      '15m': 'timeframe-15m',
      '30m': 'timeframe-30m',
      '1h': 'timeframe-1h',
      '4h': 'timeframe-4h',
      '1d': 'timeframe-1d',
      '1w': 'timeframe-1w'
    };
    return colors[tf] || 'bg-gray-500/20 border-gray-500 text-gray-400';
  };

  return (
    <div className="mt-6 fade-in">
      {/* Statistics */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        <div className="signal-strong-long rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{signalStats.strong_long}</div>
          <div className="text-xs">STRONG LONG</div>
        </div>
        <div className="signal-long rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{signalStats.long}</div>
          <div className="text-xs">LONG</div>
        </div>
        <div className="signal-weak-long rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{signalStats.weak_long}</div>
          <div className="text-xs">WEAK LONG</div>
        </div>
        <div className="signal-strong-short rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{signalStats.strong_short}</div>
          <div className="text-xs">STRONG SHORT</div>
        </div>
        <div className="signal-short rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{signalStats.short}</div>
          <div className="text-xs">SHORT</div>
        </div>
        <div className="signal-weak-short rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{signalStats.weak_short}</div>
          <div className="text-xs">WEAK SHORT</div>
        </div>
        <div className="glass-effect rounded-lg p-3 text-center">
          <div className="text-xl font-bold">{data.results.length}</div>
          <div className="text-xs">TOTAL</div>
        </div>
      </div>

      {/* Timeframe Statistics */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {allTimeframes.map(tf => (
          <div key={tf} className={`rounded-lg p-2 text-center border ${getTimeframeColor(tf)}`}>
            <div className="text-lg font-bold">{timeframeStats[tf] || 0}</div>
            <div className="text-xs">{tf}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Signal Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              📊 Signal Type
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Signals', count: data.results.length },
                { value: 'long', label: '🟢 LONG', count: signalStats.strong_long + signalStats.long + signalStats.weak_long },
                { value: 'short', label: '🔴 SHORT', count: signalStats.strong_short + signalStats.short + signalStats.weak_short }
              ].map((filterOption) => (
                <button
                  key={filterOption.value}
                  className={`px-3 py-2 rounded-lg transition-all text-sm ${
                    filters.signalType === filterOption.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setFilters(prev => ({ ...prev, signalType: filterOption.value }))}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              ⏰ Timeframe
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-2 rounded-lg transition-all text-sm ${
                  filters.timeframe === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setFilters(prev => ({ ...prev, timeframe: 'all' }))}
              >
All Timeframes ({data.results.length})
              </button>
              {uniqueTimeframes.map(tf => (
                <button
                  key={tf}
                  className={`px-3 py-2 rounded-lg transition-all text-sm ${getTimeframeColor(tf)} ${
                    filters.timeframe === tf ? 'ring-2 ring-white ring-opacity-50' : ''
                  }`}
                  onClick={() => setFilters(prev => ({ ...prev, timeframe: tf }))}
                >
                  {tf} ({timeframeStats[tf] || 0})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.signalType !== 'all' && (
            <span className="px-2 py-1 bg-blue-500/20 border border-blue-500 rounded text-xs">
Signal: {filters.signalType === 'long' ? 'LONG' : 'SHORT'}
            </span>
          )}
          {filters.timeframe !== 'all' && (
            <span className={`px-2 py-1 rounded text-xs ${getTimeframeColor(filters.timeframe)}`}>
Time: {filters.timeframe}
            </span>
          )}
          {(filters.signalType !== 'all' || filters.timeframe !== 'all') && (
            <button
              className="px-2 py-1 bg-red-500/20 border border-red-500 rounded text-xs hover:bg-red-500/30"
              onClick={() => setFilters({ signalType: 'all', timeframe: 'all' })}
            >
Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-center">
        <div className="glass-effect inline-block px-4 py-2 rounded-lg">
          <span className="text-blue-400 font-semibold">{filteredResults.length}</span> results found
          {(filters.signalType !== 'all' || filters.timeframe !== 'all') && (
            <span className="text-gray-400 text-sm ml-2">
(filtered)
            </span>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-700/50 font-medium text-sm">
          <div className="col-span-2">Coin</div>
          <div className="col-span-1">Time</div>
          <div className="col-span-2">Signal</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1">ATR</div>
          <div className="col-span-1">ADX</div>
          <div className="col-span-1">KZ</div>
          <div className="col-span-1">S/D</div>
          <div className="col-span-1">FVG</div>
          <div className="col-span-1">Chart</div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredResults.length > 0 ? (
            filteredResults.map((result, index) => (
              <div
                key={`${result.symbol}-${result.timeframe}-${index}`}
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-all text-sm"
              >
                {/* Coin */}
                <div className="col-span-2 font-mono font-bold">
                  {result.symbol}
                </div>
                
                {/* Timeframe */}
                <div className={`col-span-1 font-mono ${getTimeframeColor(result.timeframe)} px-2 py-1 rounded text-center`}>
                  {result.timeframe}
                </div>
                
                {/* Sinyal */}
                <div className={`col-span-2 px-2 py-1 rounded text-center font-medium ${getSignalColor(result.final_signal)}`}>
                  {getSignalIcon(result.final_signal)} {result.final_signal}
                </div>
                
                {/* Price */}
                <div className="col-span-1 font-mono">${result.price.toFixed(4)}</div>
                
                {/* ATR */}
                <div className="col-span-1 font-mono text-orange-400">{Number(result.atr).toFixed(4)}</div>
                
                {/* ADX */}
                <div className="col-span-1 font-mono text-purple-400">{Number(result.adx).toFixed(1)}</div>
                
                {/* Killzone */}
                <div className="col-span-1 text-cyan-400 text-sm">{result.killzone || '-'}</div>
                
                {/* Supply/Demand */}
                <div className="col-span-1 font-mono text-xs">
                  <span className="text-red-400">{result.supply_zones}</span>/
                  <span className="text-green-400">{result.demand_zones}</span>
                </div>
                
                {/* FVG */}
                <div className="col-span-1 font-mono text-xs">
                  <span className="text-green-400">{result.fvg_bullish}</span>/
                  <span className="text-red-400">{result.fvg_bearish}</span>
                </div>
                
                {/* TradingView Link - Chart Icon */}
                <div className="col-span-1">
                  <a
                    href={getTradingViewLink(result.symbol, result.timeframe)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-200 transform hover:scale-110 group relative"
                    title={`Open ${result.symbol} - ${result.timeframe} TradingView Chart`}
                  >
                    {/* Chart Icon */}
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                      />
                    </svg>
                    
                    {/* Hover Tooltip */}
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-gray-600">
                      📈 Open Chart
                    </span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">
              ❌ No results found for the selected filters
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {filteredResults.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center items-center">
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded text-white text-xs">
              📈
            </span>
You can open TradingView charts for <strong>{filteredResults.length} coins</strong>
          </div>
        </div>
      )}

      {/* Last Update */}
      <div className="mt-4 text-center text-gray-400 text-sm">
Last Update: {new Date(data.timestamp).toLocaleString('en-US')}
      </div>
    </div>
  );
}