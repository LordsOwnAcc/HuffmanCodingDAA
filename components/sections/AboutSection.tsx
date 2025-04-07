"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import HuffmanTreeVisualization from "@/components/visualizations/HuffmanTreeVisualization"

export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      },
    }),
  }

  return (
    <section id="about" ref={ref} className="py-20 px-4 relative bg-white dark:bg-gray-950">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400">
            About Huffman Coding
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            A clever algorithm that assigns shorter codes to frequently occurring characters and longer codes to less
            frequent ones.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">What is Huffman Coding?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Huffman coding is a lossless data compression algorithm developed by David A. Huffman in 1952. It uses a
              variable-length encoding scheme that assigns shorter codes to more frequently occurring characters and
              longer codes to less frequent ones.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              This approach creates optimal prefix codes that minimize the average code length, making it highly
              efficient for text compression.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-purple-500/20"
          >
            <HuffmanTreeVisualization />
          </motion.div>
        </div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-2xl font-bold mb-8 text-center text-teal-600 dark:text-teal-400"
        >
          How Huffman Coding Works
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "1. Frequency Analysis",
              description: "Count the frequency of each character in the data to be compressed.",
            },
            {
              title: "2. Build Priority Queue",
              description: "Create a priority queue of nodes, each containing a character and its frequency.",
            },
            {
              title: "3. Construct Binary Tree",
              description: "Repeatedly merge the two nodes with lowest frequencies until only one node remains.",
            },
            {
              title: "4. Assign Binary Codes",
              description: "Traverse the tree, assigning 0 for left branches and 1 for right branches.",
            },
            {
              title: "5. Encode Data",
              description: "Replace each character with its corresponding binary code.",
            },
            {
              title: "6. Store Tree & Data",
              description: "Store the Huffman tree structure along with the encoded data for later decompression.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.title}
              custom={i}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={cardVariants}
            >
              <Card className="bg-white dark:bg-gray-900/50 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-teal-600 dark:text-teal-300 mb-3">{step.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/30 dark:to-teal-900/30 p-6 rounded-xl border border-teal-500/20"
        >
          <h3 className="text-2xl font-bold mb-4 text-center text-teal-600 dark:text-teal-400">Real-World Analogy</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/3">
              <Image
                src="/images/morse-code.png"
                alt="Morse code analogy"
                width={300}
                alt="Morse code analogy"
                width={300}
                height={200}
                className="rounded-lg shadow-lg"
              />
            </div>
            <p className="text-gray-700 dark:text-gray-300 md:w-2/3">
              Huffman coding is similar to Morse code, where common letters like 'E' get shorter codes (a single dot),
              while rare letters like 'Q' get longer codes. This makes messages shorter overall, just like ZIP files
              make your data smaller by using shorter codes for common patterns.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

