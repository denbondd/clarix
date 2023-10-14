'use client'

import './markdown.css'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Toolbar from './toolbar'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Clarix | AI knows your staff.',
  description: 'Clarix - the best)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <div className='flex flex-col max-w-[100rem] min-h-screen m-auto'>
                <div>
                  <Toolbar />
                </div>
                <div className='flex-1'>
                  {children}
                </div>
              </div>
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
