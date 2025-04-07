// Node structure for Huffman tree
interface HuffmanNode {
  char?: string
  freq: number
  left?: HuffmanNode
  right?: HuffmanNode
}

// Priority queue implementation for Huffman algorithm
class PriorityQueue {
  private nodes: HuffmanNode[] = []

  enqueue(node: HuffmanNode): void {
    this.nodes.push(node)
    this.nodes.sort((a, b) => a.freq - b.freq)
  }

  dequeue(): HuffmanNode | undefined {
    return this.nodes.shift()
  }

  get size(): number {
    return this.nodes.length
  }
}

// Build frequency table from text
function buildFrequencyTable(text: string): Record<string, number> {
  const freqTable: Record<string, number> = {}

  for (const char of text) {
    freqTable[char] = (freqTable[char] || 0) + 1
  }

  return freqTable
}

// Build Huffman tree from frequency table
function buildHuffmanTree(freqTable: Record<string, number>): HuffmanNode | undefined {
  const pq = new PriorityQueue()

  // Create leaf nodes for each character
  for (const [char, freq] of Object.entries(freqTable)) {
    pq.enqueue({ char, freq })
  }

  // Special case: only one unique character
  if (pq.size === 1) {
    const node = pq.dequeue()!
    return { freq: node.freq, left: node }
  }

  // Build the tree by combining nodes
  while (pq.size > 1) {
    const left = pq.dequeue()!
    const right = pq.dequeue()!

    const parent: HuffmanNode = {
      freq: left.freq + right.freq,
      left,
      right,
    }

    pq.enqueue(parent)
  }

  return pq.dequeue()
}

// Generate Huffman codes from tree
function generateCodes(
  node: HuffmanNode | undefined,
  prefix = "",
  codes: Record<string, string> = {},
): Record<string, string> {
  if (!node) return codes

  if (node.char !== undefined) {
    codes[node.char] = prefix || "0" // Default to '0' for single character case
    return codes
  }

  if (node.left) {
    generateCodes(node.left, prefix + "0", codes)
  }

  if (node.right) {
    generateCodes(node.right, prefix + "1", codes)
  }

  return codes
}

// Encode text using Huffman codes
function encodeText(text: string, codes: Record<string, string>): string {
  let encoded = ""

  for (const char of text) {
    encoded += codes[char]
  }

  return encoded
}

// Serialize Huffman tree for storage
function serializeTree(node: HuffmanNode | undefined): string {
  if (!node) return ""

  if (node.char !== undefined) {
    // Leaf node: 1 + character
    return "1" + node.char
  }

  // Internal node: 0 + left subtree + right subtree
  return "0" + serializeTree(node.left) + serializeTree(node.right)
}

// Deserialize Huffman tree
function deserializeTree(data: string): { node: HuffmanNode | undefined; remainingData: string } {
  if (!data.length) {
    return { node: undefined, remainingData: "" }
  }

  const bit = data[0]
  const remainingData = data.slice(1)

  if (bit === "1") {
    // Leaf node
    if (!remainingData.length) {
      throw new Error("Invalid tree data")
    }

    const char = remainingData[0]
    return {
      node: { char, freq: 0 },
      remainingData: remainingData.slice(1),
    }
  }

  // Internal node
  const leftResult = deserializeTree(remainingData)
  const rightResult = deserializeTree(leftResult.remainingData)

  return {
    node: {
      freq: 0,
      left: leftResult.node,
      right: rightResult.node,
    },
    remainingData: rightResult.remainingData,
  }
}

// Decode text using Huffman tree
function decodeText(encoded: string, tree: HuffmanNode | undefined): string {
  if (!tree) return ""

  let decoded = ""
  let current = tree

  for (const bit of encoded) {
    if (bit === "0") {
      current = current.left!
    } else {
      current = current.right!
    }

    if (current.char !== undefined) {
      decoded += current.char
      current = tree
    }
  }

  return decoded
}

// Format for storing compressed data
interface CompressedData {
  tree: string
  encoded: string
  padding: number
}

// Convert binary string to bytes for storage
function binaryStringToBytes(binary: string): Uint8Array {
  // Pad the binary string to multiple of 8
  const padding = 8 - (binary.length % 8 || 8)
  const paddedBinary = binary + "0".repeat(padding)

  const bytes = new Uint8Array(paddedBinary.length / 8)

  for (let i = 0; i < paddedBinary.length; i += 8) {
    const byte = paddedBinary.slice(i, i + 8)
    bytes[i / 8] = Number.parseInt(byte, 2)
  }

  return bytes
}

// Convert bytes back to binary string
function bytesToBinaryString(bytes: Uint8Array, padding: number): string {
  let binary = ""

  for (const byte of bytes) {
    binary += byte.toString(2).padStart(8, "0")
  }

  // Remove padding
  return binary.slice(0, -padding)
}

// Compress text using Huffman coding
export async function compressText(text: string): Promise<{ encodedString: string; compressedData: Blob }> {
  // Build frequency table
  const freqTable = buildFrequencyTable(text)

  // Build Huffman tree
  const tree = buildHuffmanTree(freqTable)

  // Generate codes
  const codes = generateCodes(tree)

  // Encode text
  const encoded = encodeText(text, codes)

  // Serialize tree
  const serializedTree = serializeTree(tree)

  // Create compressed data structure
  const padding = 8 - (encoded.length % 8 || 8)
  const compressedData: CompressedData = {
    tree: serializedTree,
    encoded,
    padding,
  }

  // Convert to JSON for storage
  const jsonData = JSON.stringify(compressedData)

  // Create blob
  const blob = new Blob([jsonData], { type: "application/json" })

  return {
    encodedString: jsonData,
    compressedData: blob,
  }
}

// Decompress text using Huffman coding
export async function decompressText(compressedText: string): Promise<string> {
  try {
    // Parse JSON data
    const compressedData: CompressedData = JSON.parse(compressedText)

    // Deserialize tree
    const { node: tree } = deserializeTree(compressedData.tree)

    // Decode text
    const decoded = decodeText(compressedData.encoded, tree)

    return decoded
  } catch (error) {
    throw new Error("Invalid compressed data format")
  }
}

// Compress a file using Huffman coding
export async function compressFile(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string
        const { compressedData } = await compressText(text)
        resolve(compressedData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    reader.readAsText(file)
  })
}

// Decompress a file using Huffman coding
export async function decompressFile(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (event) => {
      try {
        const compressedText = event.target?.result as string
        const decompressed = await decompressText(compressedText)
        const blob = new Blob([decompressed], { type: "text/plain" })
        resolve(blob)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    reader.readAsText(file)
  })
}

