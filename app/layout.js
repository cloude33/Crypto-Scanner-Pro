import './globals.css'
import ThemeProvider from '../components/ThemeProvider'

export const metadata = {
  title: 'Crypto Scanner Pro',
  description: 'Multi-Exchange - Long and Short Signals with ICT Strategy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}