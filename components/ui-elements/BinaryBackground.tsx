"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export default function BinaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Binary digits
    const binary = ["0", "1"]

    // Columns for binary rain
    const columns = Math.floor(canvas.width / 20)
    const drops: number[] = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height)
    }

    // Drawing function
    const draw = () => {
      // Black semi-transparent BG to show trail
      ctx.fillStyle = theme === "dark" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set color and font
      ctx.fillStyle = theme === "dark" ? "#0ff3" : "#0084ff3"
      ctx.font = "15px monospace"

      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        // Random binary character
        const text = binary[Math.floor(Math.random() * binary.length)]

        // x = i * fontSize, y = value of drops[i]
        ctx.fillText(text, i * 20, drops[i] * 20)

        // Sending the drop back to the top randomly after it crosses the screen
        // Adding randomness to the reset to make the drops scattered
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Increment y coordinate
        drops[i]++
      }
    }

    // Animation loop
    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 binary-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: theme === "dark" ? 0.2 : 0.05 }}
      transition={{ duration: 2 }}
    />
  )
}

