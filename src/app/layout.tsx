import "./markdown.css"
import "./globals.css"
import { Inter } from "next/font/google"
import Toolbar from "./toolbar"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col max-w-[100rem] min-h-screen m-auto">
            <div>
              <Toolbar />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
