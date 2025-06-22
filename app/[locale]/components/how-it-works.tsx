"use client"

import { motion } from "framer-motion"
import { Search, MessageCircle, Sparkles, ArrowRight } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: "Ask a Question",
      description: "Post your academic queries and get help from the community."
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "Receive Answers",
      description: "Get responses from peers and educators, often within minutes."
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "Learn & Grow",
      description: "Expand your knowledge and improve your academic performance."
    }
  ]

  return (
    <section id="how-it-works" className=" py-24 md:py-32 flex justify-center">
      <div className="container flex flex-col items-center">
        <div className="flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">How It Works</h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Three simple steps to enhance your learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 w-full max-w-[1200px]">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-8">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 bg-primary/10 rounded-full w-24 h-24" />
                <div className="bg-background rounded-full p-4 border shadow-sm">
                  {step.icon}
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-border">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 