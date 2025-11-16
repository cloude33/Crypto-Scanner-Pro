'use client'
// Main page component for the Crypto Scanner application
import { useState, useEffect } from 'react';
import Scanner from '../components/Scanner';
import Results from '../components/Results';
import Loading from '../components/Loading';
import Progress from '../components/Progress';
import Header from '../components/Header';

export default function Home() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ processed: 0, total: 0, currentSymbol: '' });

  // Handle the scanning process by sending configuration to the API
  const handleScan = async (scanConfig) => {
    setLoading(true);
    setError(null);
    setProgress({ processed: 0, total: scanConfig.symbols.length, currentSymbol: '' });
    
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scanConfig),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Tarama sırasında hata oluştu');
      }
      
      const data = await response.json();
      setResults(data);
      
      // Show success message
      if (data.success && data.results.length > 0) {
        // Success handled by setting results
      } else if (data.success) {
        // No results found
        setError('Tarama tamamlandı ancak sonuç bulunamadı');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.message || 'Tarama sırasında bilinmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Simulate progress while scanning
  useEffect(() => {
    let interval;
    if (loading && progress.total > 0) {
      interval = setInterval(() => {
        setProgress(prev => {
          // Only update if we haven't reached 90% to leave room for actual completion
          if (prev.processed < Math.min(prev.total * 0.9, prev.total - 1)) {
            return {
              ...prev,
              processed: prev.processed + 1,
              currentSymbol: `Processing coin ${prev.processed + 1}...`
            };
          }
          return prev;
        });
      }, 300); // Update every 300ms
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, progress.total]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white dark:from-gray-100 dark:to-gray-200 dark:text-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Theme Toggle */}
        <Header />
        
        {/* Scanner Component */}
        <Scanner onScan={handleScan} />
        
        {/* Loading */}
        {loading && <Loading />}
        
        {/* Progress */}
        {loading && (
          <Progress 
            processed={progress.processed} 
            total={progress.total} 
            symbol={progress.currentSymbol} 
          />
        )}
        
        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg animate-pulse">
            <p className="text-red-300">❌ {error}</p>
          </div>
        )}
        
        {/* Results */}
        {results && !loading && <Results data={results} />}
        
        {/* Success Message */}
        {results && results.success && !error && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
            <p className="text-green-300">✅ Scan completed successfully! {results.results.length} results found.</p>
          </div>
        )}
      </div>
    </div>
  );
}