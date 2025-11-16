import './globals.css'
import ThemeProvider from '../components/ThemeProvider'

export const metadata = {
  title: 'Crypto Scanner Pro',
  description: 'Çoklu Borsa - ICT Stratejisi ile Long ve Short Sinyalleri',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}