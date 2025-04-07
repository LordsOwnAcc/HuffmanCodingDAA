"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TreeNode {
  char?: string
  freq: number
  left?: TreeNode
  right?: TreeNode
  code?: string
}

export default function HuffmanTreeVisualization() {
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [codes, setCodes] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Sample text for demonstration
  const sampleText = "huffman coding example"

  // Build frequency table
  const buildFrequencyTable = (text: string) => {
    const freqTable: Record<string, number> = {}
    for (const char of text) {
      freqTable[char] = (freqTable[char] || 0) + 1
    }
    return freqTable
  }

  // Build Huffman tree
  const buildHuffmanTree = (freqTable: Record<string, number>) => {
    // Create leaf nodes
    const nodes: TreeNode[] = Object.entries(freqTable).map(([char, freq]) => ({
      char,
      freq,
    }))

    // Build tree by combining nodes
    while (nodes.length > 1) {
      // Sort nodes by frequency
      nodes.sort((a, b) => a.freq - b.freq)

      // Take two nodes with lowest frequencies
      const left = nodes.shift()!
      const right = nodes.shift()!

      // Create new internal node
      const newNode: TreeNode = {
        freq: left.freq + right.freq,
        left,
        right,
      }

      // Add new node back to the list
      nodes.push(newNode)
    }

    return nodes[0]
  }

  // Generate codes from tree
  const generateCodes = (node: TreeNode, code = "", codesMap: Record<string, string> = {}) => {
    if (node.char) {
      codesMap[node.char] = code
      return codesMap
    }

    if (node.left) {
      generateCodes(node.left, code + "0", codesMap)
    }

    if (node.right) {
      generateCodes(node.right, code + "1", codesMap)
    }

    return codesMap
  }

  // Initialize tree on component mount
  useEffect(() => {
    const freqTable = buildFrequencyTable(sampleText)
    const huffmanTree = buildHuffmanTree(freqTable)
    const huffmanCodes = generateCodes(huffmanTree)

    setTree(huffmanTree)
    setCodes(huffmanCodes)

    // Start animation
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Advance step
  useEffect(() => {
    if (step < 3) {
      const timer = setTimeout(() => {
        setStep(step + 1)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [step])

  // Render tree node
  const renderNode = (
    node: TreeNode | undefined,
    depth = 0,
    direction: "left" | "right" | "root" = "root",
    path = "",
  ) => {
    if (!node) return null

    const isLeaf = Boolean(node.char)
    const nodeSize = isLeaf ? 50 : 40

    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: depth * 0.2 }}
      >
        <div className="flex flex-col items-center">
          <motion.div
            className={`flex items-center justify-center rounded-full ${
              isLeaf ? "bg-teal-500/80" : "bg-purple-500/80"
            }`}
            style={{
              width: nodeSize,
              height: nodeSize,
            }}
          >
            {isLeaf ? (
              <div className="text-center">
                <div className="text-white font-bold">{node.char}</div>
                <div className="text-xs text-white/80">{node.freq}</div>
              </div>
            ) : (
              <div className="text-white font-bold">{node.freq}</div>
            )}
          </motion.div>

          {isLeaf && step >= 2 && (
            <motion.div
              className="mt-2 px-2 py-1 bg-teal-900/50 rounded text-xs text-teal-300 font-mono"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {codes[node.char!] || ""}
            </motion.div>
          )}

          {direction !== "root" && (
            <div
              className={`absolute ${direction === "left" ? "right-0 top-1/2" : "left-0 top-1/2"} w-8 h-px bg-gray-600`}
              style={{
                [direction === "left" ? "right" : "left"]: "100%",
              }}
            />
          )}

          {(node.left || node.right) && (
            <div className="mt-4 flex gap-8">
              {node.left && renderNode(node.left, depth + 1, "left", path + "0")}
              {node.right && renderNode(node.right, depth + 1, "right", path + "1")}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Render frequency table
  const renderFrequencyTable = () => {
    if (!codes) return null

    return (
      <motion.div
        className="mt-6 grid grid-cols-3 gap-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {Object.entries(codes).map(([char, code]) => (
          <div key={char} className="bg-gray-800/50 rounded p-2">
            <div className="text-white font-mono">'{char === " " ? "space" : char}'</div>
            {step >= 2 && <div className="text-teal-400 font-mono text-sm">{code}</div>}
          </div>
        ))}
      </motion.div>
    )
  }

  // Fix the scrolling issue in the Huffman tree visualization
  return (
    <div className="flex flex-col items-center">
      <h4 className="text-xl font-bold mb-4 text-center text-indigo-400">Huffman Tree Visualization</h4>

      <div className="relative w-full overflow-x-auto overflow-y-visible p-4">
        <div className="flex justify-center min-w-[800px] pb-4">{tree && renderNode(tree)}</div>
      </div>

      {renderFrequencyTable()}

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          {step === 0 && "Building frequency table..."}
          {step === 1 && "Frequency table created"}
          {step === 2 && "Generating Huffman codes..."}
          {step === 3 && "Huffman tree complete with optimal codes"}
        </p>
      </div>
    </div>
  )
}

