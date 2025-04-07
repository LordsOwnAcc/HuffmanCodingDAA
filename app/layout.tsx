import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import LoadingScreen from "@/components/ui-elements/LoadingScreen"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

// Update the metadata with the new name
export const metadata = {
  title: "BinaryMagic - Smart Data Compression",
  description: "Learn and experiment with Huffman Coding compression algorithm",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <LoadingScreen />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'