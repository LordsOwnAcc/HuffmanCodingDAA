"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Download, Upload, Copy, Check, Zap, Loader2 } from "lucide-react"
import { compressText, decompressText } from "@/lib/huffman"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function TextCompressionSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [activeTab, setActiveTab] = useState("compress")
  const { user, saveCompressionHistory } = useAuth()
  const { toast } = useToast()

  // Compress state
  const [inputText, setInputText] = useState("")
  const [compressedText, setCompressedText] = useState("")
  const [compressingLoading, setCompressingLoading] = useState(false)
  const [compressionStats, setCompressionStats] = useState({
    originalSize: 0,
    compressedSize: 0,
    ratio: 0,
  })
  const [copySuccess, setCopySuccess] = useState(false)

  // Decompress state
  const [encodedText, setEncodedText] = useState("")
  const [decompressedText, setDecompressedText] = useState("")
  const [decompressingLoading, setDecompressingLoading] = useState(false)
  const [decompressError, setDecompressError] = useState("")
  const [decompressCopySuccess, setDecompressCopySuccess] = useState(false)

  // Handle text compression
  const handleCompressText = async () => {
    if (!inputText.trim()) return

    setCompressingLoading(true)
    try {
      const result = await compressText(inputText)
      setCompressedText(result.encodedString)

      // Calculate compression stats
      const originalSize = new Blob([inputText]).size
      const compressedSize = new Blob([result.encodedString]).size

      const stats = {
        originalSize,
        compressedSize,
        ratio: originalSize / compressedSize,
      }

      setCompressionStats(stats)

      // Save to history if user is logged in
      if (user) {
        await saveCompressionHistory({
          type: "text",
          originalContent: inputText.substring(0, 100) + (inputText.length > 100 ? "..." : ""),
          originalSize,
          compressedSize,
          ratio: originalSize / compressedSize,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Compression error:", error)
      toast({
        title: "Compression Error",
        description: "There was an error compressing your text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCompressingLoading(false)
    }
  }

  // Handle text decompression
  const handleDecompressText = async () => {
    if (!encodedText.trim()) return

    setDecompressingLoading(true)
    setDecompressError("")

    try {
      const result = await decompressText(encodedText)
      setDecompressedText(result)
    } catch (error) {
      console.error("Decompression error:", error)
      setDecompressError("Invalid compressed format. Please ensure you're using Huffman encoded text.")
    } finally {
      setDecompressingLoading(false)
    }
  }

  // Copy compressed text to clipboard
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(compressedText)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  // Copy decompressed text to clipboard
  const copyDecompressedToClipboard = async () => {
    await navigator.clipboard.writeText(decompressedText)
    setDecompressCopySuccess(true)
    setTimeout(() => setDecompressCopySuccess(false), 2000)
  }

  // Download compressed text as file
  const downloadCompressedText = () => {
    const blob = new Blob([compressedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "compressed.huff"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download decompressed text as file
  const downloadDecompressedText = () => {
    const blob = new Blob([decompressedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "decompressed.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle file upload for decompression
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setEncodedText(content)
    }
    reader.readAsText(file)
  }

  // Format byte size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Reset copy success when tab changes
  useEffect(() => {
    setCopySuccess(false)
    setDecompressCopySuccess(false)
  }, [activeTab])

  return (
    <section id="text-compression" ref={ref} className="py-20 px-4 relative bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-600 dark:from-purple-400 dark:to-teal-400">
            Try It Yourself – Text Compression
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Enter text to compress it using the Huffman algorithm, or paste encoded text to decompress it.
            {!user && (
              <span className="block mt-2 text-sm text-cyan-600 dark:text-cyan-400">
                Sign in to save your compression history!
              </span>
            )}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="compress" className="w-full max-w-4xl mx-auto" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="compress" className="text-lg py-3">
                Compress Text
              </TabsTrigger>
              <TabsTrigger value="decompress" className="text-lg py-3">
                Decompress Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compress">
              <Card className="bg-white dark:bg-gray-900/50 border-cyan-500/20">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <label htmlFor="input-text" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Enter text to compress:
                    </label>
                    <Textarea
                      id="input-text"
                      placeholder="Type or paste your text here..."
                      className="min-h-[150px] bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-center mb-6">
                    <Button
                      onClick={handleCompressText}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-full shadow-md transition-all duration-300"
                      disabled={!inputText.trim() || compressingLoading}
                    >
                      {compressingLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Compressing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Compress Text
                        </>
                      )}
                    </Button>
                  </div>

                  {compressedText && (
                    <>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <label htmlFor="compressed-text" className="block text-gray-700 dark:text-gray-300">
                            Compressed result:
                          </label>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={copyToClipboard}
                              className="border-cyan-500/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50"
                            >
                              {copySuccess ? (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={downloadCompressedText}
                              className="border-cyan-500/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          id="compressed-text"
                          className="min-h-[150px] bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 font-mono text-sm"
                          value={compressedText}
                          readOnly
                        />
                      </div>

                      <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-4 text-cyan-600 dark:text-cyan-400">
                          Compression Statistics
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Original Size</p>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {formatBytes(compressionStats.originalSize)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Compressed Size</p>
                            <p className="text-cyan-600 dark:text-cyan-400 font-medium">
                              {formatBytes(compressionStats.compressedSize)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Compression Ratio</p>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {compressionStats.ratio.toFixed(2)}x smaller
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decompress">
              <Card className="bg-white dark:bg-gray-900/50 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <label htmlFor="encoded-text" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Enter encoded text to decompress:
                    </label>
                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-100 dark:bg-gray-800/30 hover:border-purple-500/50 transition-colors">
                      <label htmlFor="encoded-file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Upload a .huff file</span>
                        </div>
                        <input
                          id="encoded-file-upload"
                          type="file"
                          accept=".huff,.txt"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                    <Textarea
                      id="encoded-text"
                      placeholder="Paste encoded text here..."
                      className="min-h-[150px] bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 font-mono text-sm"
                      value={encodedText}
                      onChange={(e) => setEncodedText(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-center mb-6">
                    <Button
                      onClick={handleDecompressText}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-full shadow-md transition-all duration-300"
                      disabled={!encodedText.trim() || decompressingLoading}
                    >
                      {decompressingLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Decompressing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Decompress Text
                        </>
                      )}
                    </Button>
                  </div>

                  {decompressError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/50 rounded-lg p-4 mb-6">
                      <p className="text-red-600 dark:text-red-400">{decompressError}</p>
                    </div>
                  )}

                  {decompressedText && !decompressError && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="decompressed-text" className="block text-gray-700 dark:text-gray-300">
                          Decompressed result:
                        </label>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyDecompressedToClipboard}
                            className="border-purple-500/50 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                          >
                            {decompressCopySuccess ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadDecompressedText}
                            className="border-purple-500/50 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        id="decompressed-text"
                        className="min-h-[150px] bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700"
                        value={decompressedText}
                        readOnly
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}

