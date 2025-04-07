"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Download, FileUp, ArrowRight, Loader2 } from "lucide-react"
import { compressFile, decompressFile } from "@/lib/huffman"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function FileCompressionSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { user, saveCompressionHistory } = useAuth()
  const { toast } = useToast()

  const [compressState, setCompressState] = useState({
    file: null as File | null,
    originalSize: 0,
    compressedSize: 0,
    compressedData: null as Blob | null,
    loading: false,
    error: "",
    success: false,
  })

  const [decompressState, setDecompressState] = useState({
    file: null as File | null,
    originalSize: 0,
    decompressedSize: 0,
    decompressedData: null as Blob | null,
    loading: false,
    error: "",
    success: false,
  })

  const handleCompressFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCompressState({
      ...compressState,
      file,
      originalSize: file.size,
      loading: true,
      error: "",
      success: false,
    })

    try {
      const result = await compressFile(file)

      setCompressState({
        ...compressState,
        file,
        originalSize: file.size,
        compressedSize: result.size,
        compressedData: result,
        loading: false,
        success: true,
      })

      // Save to history if user is logged in
      if (user) {
        await saveCompressionHistory({
          type: "file",
          fileName: file.name,
          originalSize: file.size,
          compressedSize: result.size,
          ratio: file.size / result.size,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      setCompressState({
        ...compressState,
        loading: false,
        error: "Error compressing file. Please try again.",
      })

      toast({
        title: "Compression Error",
        description: "There was an error compressing your file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDecompressFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setDecompressState({
      ...decompressState,
      file,
      originalSize: file.size,
      loading: true,
      error: "",
      success: false,
    })

    try {
      const result = await decompressFile(file)

      setDecompressState({
        ...decompressState,
        file,
        originalSize: file.size,
        decompressedSize: result.size,
        decompressedData: result,
        loading: false,
        success: true,
      })
    } catch (error) {
      setDecompressState({
        ...decompressState,
        loading: false,
        error: "Error decompressing file. Please ensure it's a valid Huffman compressed file.",
      })

      toast({
        title: "Decompression Error",
        description: "There was an error decompressing your file. Please ensure it's a valid Huffman compressed file.",
        variant: "destructive",
      })
    }
  }

  const downloadCompressedFile = () => {
    if (!compressState.compressedData) return

    const url = URL.createObjectURL(compressState.compressedData)
    const a = document.createElement("a")
    a.href = url
    a.download = `${compressState.file?.name || "compressed"}.huff`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadDecompressedFile = () => {
    if (!decompressState.decompressedData) return

    const url = URL.createObjectURL(decompressState.decompressedData)
    const a = document.createElement("a")
    a.href = url
    a.download = `${decompressState.file?.name.replace(".huff", "") || "decompressed"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <section id="file-compression" ref={ref} className="py-20 px-4 relative bg-white dark:bg-gray-950">
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-purple-600 dark:from-teal-400 dark:to-purple-400">
            Try It Yourself – File Compression
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Upload a text file to compress it using the Huffman algorithm, or decompress an existing Huffman-encoded
            file.
            {!user && (
              <span className="block mt-2 text-sm text-cyan-600 dark:text-cyan-400">
                Sign in to save your compression history!
              </span>
            )}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Compression Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 border-teal-500/20 h-full">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-center text-teal-600 dark:text-teal-400">
                  Compress a Text File
                </h3>

                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-6 bg-gray-100 dark:bg-gray-800/30 hover:border-teal-500/50 transition-colors">
                  <Upload className="h-10 w-10 text-gray-500 dark:text-gray-400 mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">Upload a .txt file to compress</p>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300"
                    onClick={() => document.getElementById("compress-file-upload")?.click()}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Select File
                  </Button>
                  <input
                    id="compress-file-upload"
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={handleCompressFile}
                  />
                </div>

                {compressState.loading && (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Loader2 className="h-8 w-8 text-teal-600 dark:text-teal-400 animate-spin mb-2" />
                    <p className="text-gray-700 dark:text-gray-300">Compressing file...</p>
                  </div>
                )}

                {compressState.error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/50 rounded-lg p-4 mb-4">
                    <p className="text-red-600 dark:text-red-400">{compressState.error}</p>
                  </div>
                )}

                {compressState.success && (
                  <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-6 mb-4">
                    <h4 className="text-lg font-semibold mb-4 text-teal-600 dark:text-teal-400">Compression Results</h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Original File</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {formatFileSize(compressState.originalSize)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Compressed File</p>
                        <p className="text-teal-600 dark:text-teal-400 font-medium">
                          {formatFileSize(compressState.compressedSize)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Compression Ratio</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {(compressState.originalSize / compressState.compressedSize).toFixed(2)}x smaller
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={downloadCompressedFile}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Compressed File
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Decompression Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 border-purple-500/20 h-full">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
                  Decompress a File
                </h3>

                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-6 bg-gray-100 dark:bg-gray-800/30 hover:border-purple-500/50 transition-colors">
                  <Upload className="h-10 w-10 text-gray-500 dark:text-gray-400 mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">Upload a .huff file to decompress</p>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300"
                    onClick={() => document.getElementById("decompress-file-upload")?.click()}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Select File
                  </Button>
                  <input
                    id="decompress-file-upload"
                    type="file"
                    accept=".huff"
                    className="hidden"
                    onChange={handleDecompressFile}
                  />
                </div>

                {decompressState.loading && (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin mb-2" />
                    <p className="text-gray-700 dark:text-gray-300">Decompressing file...</p>
                  </div>
                )}

                {decompressState.error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/50 rounded-lg p-4 mb-4">
                    <p className="text-red-600 dark:text-red-400">{decompressState.error}</p>
                  </div>
                )}

                {decompressState.success && (
                  <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-6 mb-4">
                    <h4 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">
                      Decompression Results
                    </h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Compressed File</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {formatFileSize(decompressState.originalSize)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Decompressed File</p>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">
                          {formatFileSize(decompressState.decompressedSize)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Original Content Restored</p>
                      <p className="text-gray-900 dark:text-white font-medium">100% lossless decompression</p>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={downloadDecompressedFile}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Decompressed File
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-700 dark:text-gray-300 mb-4">Want to compress or decompress text directly?</p>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300"
            onClick={() => document.getElementById("text-compression")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="flex items-center">
              Try Text Compression
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

