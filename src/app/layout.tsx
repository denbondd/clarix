import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Toolbar from './toolbar'
import { Toaster } from '@/components/ui/toaster'

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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className='flex flex-col max-w-[100rem] m-auto px-2'>
            <div>
              <Toolbar />
            </div>
            <div className='flex-1'>
              {children}
            </div>
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
