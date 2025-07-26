"use client"

import { Link } from "@/i18n/navigation"
import { motion } from "framer-motion"
import { Sparkles, HelpCircle, BookOpen } from "lucide-react"
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
            <span>{t('badge')}</span>
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-8">
            {t('title')}
          </h1>
          
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mb-12">
            {t('subtitle')}
          </p>
          

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
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{t('qaCommunity')}</h3>
                <p className="text-sm text-muted-foreground">{t('qaDescription')}</p>
              </div>
            </Link>

            <Link 
              href="/courses" 
              className="group p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{t('courseLibrary')}</h3>
                <p className="text-sm text-muted-foreground">{t('courseDescription')}</p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 