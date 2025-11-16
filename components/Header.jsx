// Header component with theme toggle functionality
'use client'
import { useTheme } from './ThemeProvider'

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="text-center mb-8 relative">
      {/* Theme Toggle Button */}
      <div className="absolute right-0 top-0">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg glass-effect hover:bg-gray-700/50 transition-all duration-200"
          title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
        >
          {theme === 'dark' ? (
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-2">
        🎯 Crypto Scanner Pro
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
Multi-Exchange - Long and Short Signals with ICT Strategy
      </p>
    </div>
  )
}