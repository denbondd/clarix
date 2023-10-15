"use client"

import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SessionProvider } from "next-auth/react"
import { SWRConfig } from "swr"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <SWRConfig value={{ revalidateIfStale: false }}>
            {children}
          </SWRConfig>
        </TooltipProvider>
      </ThemeProvider>
      <Toaster />
    </SessionProvider>
  )
}
