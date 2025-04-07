"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { ArrowLeft, FileText, File, Calendar, Clock, Scale } from "lucide-react"
import Header from "@/components/sections/Header"

export default function HistoryPage() {
  const { user, compressionHistory } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  if (!user) {
    router.push("/login")
    return null
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" className="mb-6 text-gray-600 dark:text-gray-400" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Compression History</CardTitle>
                <CardDescription>View your past compression activities and results</CardDescription>
              </CardHeader>

              <CardContent>
                {compressionHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You haven't compressed any files or text yet.
                    </p>
                    <Button onClick={() => router.push("/#file-compression")} className="bg-cyan-600 hover:bg-cyan-700">
                      Try compression now
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {compressionHistory.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 md:w-16 flex items-center justify-center">
                              {item.type === "text" ? (
                                <FileText className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                              ) : (
                                <File className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                              )}
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {item.type === "text" ? "Text Compression" : `File: ${item.fileName}`}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(item.timestamp)}
                                  <Clock className="h-4 w-4 ml-3 mr-1" />
                                  {formatTime(item.timestamp)}
                                </div>
                              </div>

                              {item.type === "text" && item.originalContent && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-1">
                                  {item.originalContent}
                                </p>
                              )}

                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Original Size</p>
                                  <p className="font-medium">{formatBytes(item.originalSize)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Compressed Size</p>
                                  <p className="font-medium text-cyan-600 dark:text-cyan-400">
                                    {formatBytes(item.compressedSize)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Ratio</p>
                                  <p className="font-medium flex items-center">
                                    <Scale className="h-3 w-3 mr-1" />
                                    {item.ratio.toFixed(2)}x smaller
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}

