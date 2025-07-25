"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Lightbulb, Users, BookOpen, Trophy, ThumbsUp } from "lucide-react"
import { useTranslations } from 'next-intl'

const MotionCard = motion(Card)

export function Features() {
  const t = useTranslations('LandingPage.features');
  
  const features = [
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: t('askAnswer.title'),
      description: t('askAnswer.description')
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: t('aiInsights.title'),
      description: t('aiInsights.description')
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: t('collaborativeLearning.title'),
      description: t('collaborativeLearning.description')
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: t('knowledgeBase.title'),
      description: t('knowledgeBase.description')
    },
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: t('reputationSystem.title'),
      description: t('reputationSystem.description')
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-primary" />,
      title: t('qualityControl.title'),
      description: t('qualityControl.description')
    }
  ]

  return (
    <section id="features" className="py-24 md:py-32 flex justify-center bg-muted/40">
      <div className="container flex flex-col items-center">
        <div className="flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{t('title')}</h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {t('subtitle')}
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