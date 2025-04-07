"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

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

    // Binary digits and symbols
    const characters = ["0", "1", "01", "10", "{", "}", "<", ">", "/", "*"]

    // Particles for dynamic effect
    const particles: {
      x: number
      y: number
      size: number
      speed: number
      character: string
      opacity: number
      color: string
    }[] = []

    // Create particles
    const createParticles = () => {
      const particleCount = Math.floor(window.innerWidth / 20)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 12 + 8,
          speed: Math.random() * 1 + 0.5,
          character: characters[Math.floor(Math.random() * characters.length)],
          opacity: Math.random() * 0.5 + 0.1,
          color:
            resolvedTheme === "dark"
              ? `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 150)}, ${Math.floor(Math.random() * 55 + 200)}, 0.7)`
              : `rgba(${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100 + 155)}, 0.5)`,
        })
      }
    }

    createParticles()

    // Animation loop
    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = resolvedTheme === "dark" ? "rgba(10, 10, 25, 0.1)" : "rgba(255, 255, 255, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particle
        particle.y += particle.speed

        // Reset if off screen
        if (particle.y > canvas.height) {
          particle.y = -20
          particle.x = Math.random() * canvas.width
          particle.character = characters[Math.floor(Math.random() * characters.length)]
        }

        // Draw particle
        ctx.font = `${particle.size}px monospace`
        ctx.fillStyle = particle.color
        ctx.fillText(particle.character, particle.x, particle.y)

        // Add glow effect for some particles
        if (Math.random() > 0.95) {
          ctx.shadowColor = resolvedTheme === "dark" ? "rgba(0, 255, 255, 0.5)" : "rgba(0, 100, 255, 0.3)"
          ctx.shadowBlur = 10
          ctx.fillText(particle.character, particle.x, particle.y)
          ctx.shadowBlur = 0
        }
      })

      // Add connections between nearby particles
      if (resolvedTheme === "dark") {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * (1 - distance / 100)})`
              ctx.lineWidth = 0.5
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [resolvedTheme])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 opacity-30 dark:opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  )
}

