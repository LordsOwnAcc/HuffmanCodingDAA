"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, User, History, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const navItems = [
    { name: "How It Works", href: "#about" },
    { name: "Applications", href: "#applications" },
    { name: "Try It", href: "#file-compression" },
    { name: "Team", href: "#team" },
  ]

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                BM
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                BinaryMagic
              </h1>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Right side - Auth */}
          <div className="hidden md:flex md:items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.displayName || user.email?.split("@")[0]}
                    </span>
                    <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                      <AvatarFallback className="bg-indigo-500 text-white text-xs">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/history")}>
                    <History className="mr-2 h-4 w-4" />
                    <span>History</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-full px-4"
                onClick={() => router.push("/login")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 inline mr-2" />
                  Profile
                </Link>
                <Link
                  href="/history"
                  className="block text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <History className="h-4 w-4 inline mr-2" />
                  History
                </Link>
                <button
                  className="w-full text-left text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-base font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4 inline mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

