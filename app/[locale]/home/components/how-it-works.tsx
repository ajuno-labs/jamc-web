"use client"

import { motion } from "framer-motion"
import { Search, MessageCircle, Sparkles } from "lucide-react"
import { useTranslations } from 'next-intl'
import { StepArrow } from './step-arrow'

export function HowItWorks() {
  const t = useTranslations('LandingPage.howItWorks');
  
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: t('askQuestion.title'),
      description: t('askQuestion.description')
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: t('receiveAnswers.title'),
      description: t('receiveAnswers.description')
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: t('learnGrow.title'),
      description: t('learnGrow.description')
    }
  ]

  return (
    <section id="how-it-works" className=" py-24 md:py-32 flex justify-center">
      <div className="container flex flex-col items-center">
        <div className="flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{t('title')}</h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {t('subtitle')}
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
                {i < 2 && <StepArrow />}
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