"use client"

import { Link } from "@/i18n/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('LandingPage.hero');

  return (
    <section className="py-24 md:py-32 flex justify-center">
      <div className="container">
        <motion.div 
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-6" variant="outline">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            <span>Learning reimagined</span>
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-8">
            {t('title')}
          </h1>
          
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mb-12">
            {t('subtitle')}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Button size="lg" asChild>
              <Link href="/signup">
                {t('getStarted')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">
                {t('learnMore')}
              </Link>
            </Button>
          </div>

          {/* Navigation Cards for Authenticated Users */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link 
              href="/questions" 
              className="group p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Q&A Community</h3>
                <p className="text-sm text-muted-foreground">Ask questions and help others learn</p>
              </div>
            </Link>

            <Link 
              href="/courses" 
              className="group p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold">Course Library</h3>
                <p className="text-sm text-muted-foreground">Explore structured learning paths</p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 