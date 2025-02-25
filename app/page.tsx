"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { 
  GraduationCap, 
  Search, 
  MessageCircle, 
  Lightbulb, 
  Users, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  Trophy,
  ThumbsUp
} from "lucide-react"

const MotionCard = motion(Card)

export default function LandingPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    console.log('Email submitted:', email)
  }

  return (
    <div className="min-h-screen bg-background px-4">
      {/* Header */}
      <header className="sticky flex justify-center top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">JAMC</span>
          </div>
          <nav className="hidden md:flex md:gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Testimonials</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signin">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 md:py-32">
        <motion.div 
          className="flex flex-col items-center text-center"
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
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signin">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-b bg-muted/40">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Students" },
              { value: "500+", label: "Educators" },
              { value: "50K+", label: "Questions" },
              { value: "250K+", label: "Answers" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24 md:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">Key Features</h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Discover the tools that make JAMC Q&A the ultimate learning platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
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
          ].map((feature, i) => (
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
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted/40 py-24 md:py-32">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Three simple steps to enhance your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
            {[
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
            ].map((step, i) => (
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

      {/* Testimonials Section */}
      <section id="testimonials" className="container py-24 md:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">What Our Users Say</h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Hear from our community of students and educators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: 'Linh Nguyen', 
              role: 'Student', 
              content: 'JAMC Q&A has been a game-changer for my studies. The community is so helpful and supportive!',
              image: '/placeholder.svg' 
            },
            { 
              name: 'Dr. Tran', 
              role: 'Educator', 
              content: 'As an educator, I find JAMC Q&A an excellent platform to engage with students beyond the classroom.',
              image: '/placeholder.svg'  
            },
            { 
              name: 'Mai Pham', 
              role: 'Student', 
              content: 'The AI recommendations are spot-on! It\'s like having a personal study guide.',
              image: '/placeholder.svg'  
            }
          ].map((testimonial, i) => (
            <MotionCard 
              key={i}
              className="relative overflow-hidden" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.image} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="relative">
                  <span className="absolute -top-2 -left-1 text-6xl text-primary/10">"</span>
                  <p className="relative z-10 italic text-muted-foreground">{testimonial.content}</p>
                  <span className="absolute -bottom-10 -right-1 text-6xl text-primary/10">"</span>
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <motion.div 
            className="mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 md:text-4xl">Ready to Elevate Your Learning?</h2>
            <p className="mb-8 text-primary-foreground/80">
              Join JAMC Q&A today and become part of a thriving academic community.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mx-auto max-w-md justify-center">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground text-background sm:rounded-r-none"
                required
              />
              <Button type="submit" variant="secondary" className="sm:rounded-l-none">
                Get Started
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">JAMC Q&A</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Empowering students and educators through knowledge sharing and collaborative learning.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Platform</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Resources</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Guides</a></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Contact</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2023 JAMC Q&A. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
