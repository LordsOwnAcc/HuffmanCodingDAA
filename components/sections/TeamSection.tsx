"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function TeamSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const teamMembers = [
    {
      name: "Sumit Yadav",
      role: "Algorithm and website developer",
      bio: "Implemented the core Huffman coding algorithm and binary tree visualization.",
      image: "/placeholder.svg?height=300&width=300",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:alex@example.com",
    },
    {
      name: "Sumit Badoni",
      role: "LGBTQ+ Head",
      bio: "Gay shit.",
      image: "https://i.ibb.co/zW20rKRF/gay.jpg",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:samantha@example.com",
    },
    {
      name: "Rokstar RaviRaj Sinu Piyuh Kumar Singh Patel ",
      role: "Istunt Head",
      bio: "aiii tore mai ke chodu aiiiii...",
      image: "https://i.ibb.co/B5Ks9G6p/piyuh.jpg",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:michael@example.com",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="team" ref={ref} className="py-20 px-4 relative bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400">
            Our Team
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Meet the talented individuals who developed this Huffman Coding project.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {teamMembers.map((member, index) => (
            <motion.div key={member.name} variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden h-full">
                <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-cyan-600 dark:text-cyan-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{member.bio}</p>

                  <div className="flex space-x-4">
                    <Link
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                    <Link
                      href={member.email}
                      className="text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="sr-only">Email</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

