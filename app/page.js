'use client'
import { useState } from 'react';
import Scanner from '../components/Scanner';
import Results from '../components/Results';
import Loading from '../components/Loading';
import Header from '../components/Header';

export default function Home() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (scanConfig) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scanConfig),
      });
      
      if (!response.ok) {
        throw new Error('Tarama sırasında hata oluştu');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white dark:from-gray-100 dark:to-gray-200 dark:text-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Theme Toggle */}
        <Header />
        
        {/* Scanner Component */}
        <Scanner onScan={handleScan} />
        
        {/* Loading */}
        {loading && <Loading />}
        
        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300">❌ {error}</p>
          </div>
        )}
        
        {/* Results */}
        {results && !loading && <Results data={results} />}
      </div>
    </div>
  );
}