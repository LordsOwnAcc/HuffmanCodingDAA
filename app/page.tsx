"use client"

import { useState, useEffect } from "react"
import Hero from "@/components/sections/Hero"
import AboutSection from "@/components/sections/AboutSection"
import ApplicationsSection from "@/components/sections/ApplicationsSection"
import FileCompressionSection from "@/components/sections/FileCompressionSection"
import TextCompressionSection from "@/components/sections/TextCompressionSection"
import TeamSection from "@/components/sections/TeamSection"
import MentorSection from "@/components/sections/MentorSection"
import DynamicBackground from "@/components/ui-elements/DynamicBackground"
import Header from "@/components/sections/Header"
import { Github } from "lucide-react"

export default function Home() {
  const [showBackground, setShowBackground] = useState(true)

  // Hide background when scrolling past hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.getElementById("hero")?.offsetHeight || 0
      setShowBackground(window.scrollY < heroHeight - 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="relative min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">
      {showBackground && <DynamicBackground />}
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <AboutSection />
      <ApplicationsSection />
      <FileCompressionSection />
      <TextCompressionSection />
      <TeamSection />
      <MentorSection />

      {/* GitHub Link */}
      <div className="py-10 text-center">
        <a
          href="https://github.com/yourusername/binarymagic"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Github className="h-5 w-5" />
          <span>View this project on GitHub</span>
        </a>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} BinaryMagic. All rights reserved.
        </p>
      </div>
    </main>
  )
}

