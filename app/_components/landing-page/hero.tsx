"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="py-24 md:py-32 flex justify-center">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4" variant="outline">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              <span>Learning reimagined</span>
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Connect, <span className="text-primary">Ask</span>, and <span className="text-primary">Learn</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mb-8">
              JAMC Q&A brings together students and educators in a vibrant community of 
              knowledge sharing and collaborative learning.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30" />
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-[90%] h-[90%] bg-gradient-to-br from-background via-background to-background/80 rounded-2xl border shadow-xl overflow-hidden">
                  <div className="absolute top-4 left-4 right-4 h-6 flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="absolute top-14 left-4 right-4 bottom-4">
                    <div className="w-full h-full bg-muted/30 rounded-lg flex flex-col p-4">
                      <div className="h-4 w-3/4 bg-primary/20 rounded mb-3" />
                      <div className="h-4 w-1/2 bg-primary/20 rounded mb-6" />
                      <div className="flex-1 bg-muted/50 rounded-lg p-3">
                        <div className="h-4 w-full bg-primary/10 rounded mb-2" />
                        <div className="h-4 w-full bg-primary/10 rounded mb-2" />
                        <div className="h-4 w-3/4 bg-primary/10 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 