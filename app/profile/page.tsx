"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Loader2, User, Mail, Save, ArrowLeft } from "lucide-react"
import Header from "@/components/sections/Header"

// Profile form schema
const profileSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  photoURL: z.string().optional(),
})

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Profile form
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect if not logged in
  if (!user) {
    router.push("/login")
    return null
  }

  // Handle profile update
  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsSubmitting(true)
    try {
      await updateProfile({
        displayName: data.displayName,
        photoURL: data.photoURL,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully!",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" className="mb-6 text-gray-600 dark:text-gray-400" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Your Profile</CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32 border-4 border-gray-200 dark:border-gray-700">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                      <AvatarFallback className="text-4xl bg-cyan-500 text-white">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Member since {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex-1">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                  <Input className="pl-10" placeholder="Your name" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                  <Input className="pl-10" placeholder="Your email" {...field} disabled />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="photoURL"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Picture URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/your-photo.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Enter a URL to your profile picture
                              </p>
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving changes...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save changes
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}

