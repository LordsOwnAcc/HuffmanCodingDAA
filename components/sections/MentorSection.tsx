"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Linkedin, BookOpen } from "lucide-react"
import Link from "next/link"

export default function MentorSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section
      id="mentor"
      ref={ref}
      className="py-20 px-4 relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
    >
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400">
            Project Mentor
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Our project was guided by an experienced mentor who provided valuable insights and direction.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative">
                <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image src="/images/mentor.png" alt="Dr. Sarah Johnson" fill className="object-cover" />
                </div>
              </div>
              <div className="md:w-2/3">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Dr. Sarah Johnson</h3>
                  <p className="text-cyan-600 dark:text-cyan-400 font-medium mb-4">
                    Associate Professor, Computer Science
                  </p>

                  <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Dr. Johnson specializes in data compression algorithms and information theory. With over 15 years
                      of experience in the field, she has published numerous papers on efficient encoding techniques and
                      their applications.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Her guidance was instrumental in helping our team understand the theoretical foundations of
                      Huffman coding and implement an efficient solution.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <BookOpen className="h-5 w-5 mr-2" />
                      <span>Ph.D. in Computer Science, MIT</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Mail className="h-5 w-5 mr-2" />
                      <Link
                        href="mailto:sarah.johnson@example.edu"
                        className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      >
                        sarah.johnson@example.edu
                      </Link>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Linkedin className="h-5 w-5 mr-2" />
                      <Link
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      >
                        LinkedIn Profile
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mentor's Note</h4>
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      "This team demonstrated exceptional understanding of Huffman coding principles and created an
                      impressive implementation. Their interactive visualization tools will be valuable for future
                      students learning about data compression algorithms."
                    </p>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

