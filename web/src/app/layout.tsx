import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AiCode Admin - Modern AI-Powered Code Management',
  description: 'Advanced admin dashboard for AiCode automated system with Neo glow effects',
  keywords: ['aicode', 'automation', 'code-analysis', 'admin-dashboard', 'modern-ui'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
