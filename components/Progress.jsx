// Progress component for displaying scan progress
export default function Progress({ processed, total, symbol }) {
  const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
  
  return (
    <div className="mt-4 p-4 glass-effect rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Scan Progress</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {symbol && (
        <div className="mt-2 text-sm text-gray-300 animate-pulse">
          Currently scanning: <span className="font-mono font-bold text-blue-400">{symbol}</span>
        </div>
      )}
      <div className="mt-1 text-sm text-gray-400">
        Processed: {processed} / {total} coins
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Please wait, this may take a few moments...
      </div>
    </div>
  );
}