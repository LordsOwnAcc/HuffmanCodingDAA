"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileDown } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-950 to-cyan-900/20 z-0" />

      {/* Content */}
      <div className="container mx-auto z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400">
              BinaryMagic
              <span className="block text-3xl md:text-5xl mt-2">Smart Compression</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover how Huffman Coding optimizes data by reducing file sizes without losing information.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="#text-compression">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white border-0"
              >
                Compress Text
                <FileDown className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#about">
              <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-950/50">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
        </div>
      </motion.div>
    </section>
  )
}

