"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { useTranslations } from 'next-intl'

/**
 * Renders a call-to-action subscription form with internationalized text and animated feedback.
 *
 * Displays a styled section containing a title, subtitle, email input, and subscribe button. Upon form submission, shows a thank-you message for a short duration and resets the input field. All user-facing text is localized using the `next-intl` translation hook.
 *
 * @returns The JSX element for the call-to-action subscription form.
 */
export function CTA() {
  const t = useTranslations('LandingPage.cta');
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this to your API
    console.log("Subscribing email:", email)
    setIsSubmitted(true)
    setEmail("")
    // Reset the submitted state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section className="bg-primary text-primary-foreground py-24 md:py-32 flex justify-center">
      <div className="container">
        <motion.div 
          className="flex flex-col items-center text-center max-w-[50rem] mx-auto gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {t('title')}
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-[40rem]">
            {t('subtitle')}
          </p>
          
          <div className="w-full max-w-md mx-auto mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-primary-foreground text-background border-primary-foreground/20"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="secondary" 
                  className="font-medium text-primary"
                >
                  {t('subscribe')}
                </Button>
              </div>
              
              {isSubmitted && (
                <motion.p 
                  className="text-sm text-primary-foreground/90"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {t('thankYou')}
                </motion.p>
              )}
              
              <p className="text-xs text-primary-foreground/70">
                {t('privacyNotice')}
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 