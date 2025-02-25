"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Lightbulb, Users, BookOpen, Trophy, ThumbsUp } from "lucide-react"

const MotionCard = motion(Card)

export function Features() {
  const features = [
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "Ask & Answer",
      description: "Post questions, provide answers, and engage in meaningful academic discussions."
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "AI-Powered Insights",
      description: "Receive intelligent recommendations and related content suggestions."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Collaborative Learning",
      description: "Foster a supportive community where knowledge is shared freely."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Rich Knowledge Base",
      description: "Access a growing library of questions, answers, and academic resources."
    },
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: "Reputation System",
      description: "Earn recognition for your contributions and build your academic profile."
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-primary" />,
      title: "Quality Control",
      description: "Educators verify and rate answers to ensure accuracy and reliability."
    }
  ]

  return (
    <section id="features" className="py-24 md:py-32 flex justify-center">
      <div className="container flex flex-col items-center">
        <div className="flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">Key Features</h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Discover the tools that make JAMC Q&A the ultimate learning platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[1200px]">
          {features.map((feature, i) => (
            <MotionCard 
              key={i}
              className="relative overflow-hidden group" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  )
} 