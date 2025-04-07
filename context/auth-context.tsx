"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user type
interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

// Define compression history item type
interface CompressionHistoryItem {
  id?: string
  type: "text" | "file"
  originalContent?: string
  fileName?: string
  originalSize: number
  compressedSize: number
  ratio: number
  timestamp: string
}

// Define auth context type
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  compressionHistory: CompressionHistoryItem[]
  saveCompressionHistory: (item: CompressionHistoryItem) => Promise<void>
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [compressionHistory, setCompressionHistory] = useState<CompressionHistoryItem[]>([])

  // Mock authentication for demo purposes
  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("huffman_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Load compression history from localStorage
    const storedHistory = localStorage.getItem("huffman_history")
    if (storedHistory) {
      setCompressionHistory(JSON.parse(storedHistory))
    }

    setLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock login - in a real app, this would call an authentication API
      const mockUser: User = {
        uid: "user123",
        email,
        displayName: email.split("@")[0],
        photoURL: null,
      }

      setUser(mockUser)
      localStorage.setItem("huffman_user", JSON.stringify(mockUser))

      // Load user's compression history
      const mockHistory = localStorage.getItem("huffman_history") || "[]"
      setCompressionHistory(JSON.parse(mockHistory))
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      // Mock signup - in a real app, this would call an authentication API
      const mockUser: User = {
        uid: "user123",
        email,
        displayName: name,
        photoURL: null,
      }

      setUser(mockUser)
      localStorage.setItem("huffman_user", JSON.stringify(mockUser))

      // Initialize empty compression history
      setCompressionHistory([])
      localStorage.setItem("huffman_history", JSON.stringify([]))
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setLoading(true)
    try {
      // Mock logout
      setUser(null)
      localStorage.removeItem("huffman_user")
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (email: string) => {
    setLoading(true)
    try {
      // Mock password reset - in a real app, this would send a reset email
      console.log(`Password reset email sent to ${email}`)
    } catch (error) {
      console.error("Reset password error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    setLoading(true)
    try {
      // Mock profile update
      if (user) {
        const updatedUser = { ...user, ...data }
        setUser(updatedUser)
        localStorage.setItem("huffman_user", JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Save compression history function
  const saveCompressionHistory = async (item: CompressionHistoryItem) => {
    try {
      // Add unique ID and ensure user is logged in
      if (user) {
        const newItem = {
          ...item,
          id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }

        const updatedHistory = [newItem, ...compressionHistory]
        setCompressionHistory(updatedHistory)
        localStorage.setItem("huffman_history", JSON.stringify(updatedHistory))
      }
    } catch (error) {
      console.error("Save compression history error:", error)
      throw error
    }
  }

  // Context value
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    compressionHistory,
    saveCompressionHistory,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

