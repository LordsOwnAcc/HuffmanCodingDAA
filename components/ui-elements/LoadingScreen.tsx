"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-gray-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 mb-8 relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-950 flex items-center justify-center">
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  BM
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              BinaryMagic
            </h1>

            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              <p className="text-gray-600 dark:text-gray-400">Loading your experience...</p>
            </div>

            <motion.div
              className="w-64 h-1 mt-8 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

