"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"
import { FileArchive, Image, Wifi, Code, Cpu, HardDrive } from "lucide-react"

export default function ApplicationsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const applications = [
    {
      title: "File Compression",
      description: "Used in ZIP, GZIP, and other file compression formats to reduce storage space.",
      icon: <FileArchive className="h-10 w-10 text-cyan-400" />,
      color: "from-cyan-500/20 to-cyan-700/20",
      borderColor: "border-cyan-500/30",
    },
    {
      title: "Image & Audio Compression",
      description: "Part of JPEG, PNG, and MP3 compression algorithms for efficient media storage.",
      icon: <Image className="h-10 w-10 text-purple-400" />,
      color: "from-purple-500/20 to-purple-700/20",
      borderColor: "border-purple-500/30",
    },
    {
      title: "Network Data Transmission",
      description: "Reduces bandwidth usage for faster data transfer across networks.",
      icon: <Wifi className="h-10 w-10 text-teal-400" />,
      color: "from-teal-500/20 to-teal-700/20",
      borderColor: "border-teal-500/30",
    },
    {
      title: "Compiler Design",
      description: "Used in compiler optimization for efficient code generation.",
      icon: <Code className="h-10 w-10 text-blue-400" />,
      color: "from-blue-500/20 to-blue-700/20",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Embedded Systems",
      description: "Critical for resource-constrained devices with limited memory and storage.",
      icon: <Cpu className="h-10 w-10 text-pink-400" />,
      color: "from-pink-500/20 to-pink-700/20",
      borderColor: "border-pink-500/30",
    },
    {
      title: "Data Storage Systems",
      description: "Optimizes storage efficiency in databases and file systems.",
      icon: <HardDrive className="h-10 w-10 text-amber-400" />,
      color: "from-amber-500/20 to-amber-700/20",
      borderColor: "border-amber-500/30",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-20 px-4 relative bg-gray-950/80">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/95 to-gray-950 z-0" />

      <div className="container mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400">
            Applications of Huffman Coding
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Huffman coding is widely used in various applications where efficient data compression is essential.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {applications.map((app, index) => (
            <motion.div key={app.title} variants={itemVariants}>
              <Card
                className={`bg-white dark:bg-gray-900 border ${app.borderColor} hover:shadow-lg transition-all duration-300 h-full`}
              >
                <CardContent className="p-6">
                  <div className="mb-4">{app.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{app.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{app.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

