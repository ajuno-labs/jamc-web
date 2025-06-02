"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      quote: "This platform has completely transformed my study habits. I've improved my grades significantly since I started using it!",
      author: "Sarah Johnson",
      role: "Biology Student"
    },
    {
      quote: "As an educator, I find this platform invaluable for engaging with students outside the classroom. It's a game-changer for modern education.",
      author: "Dr. Michael Chen",
      role: "Physics Professor"
    },
    {
      quote: "The community here is incredibly supportive. I've received help on complex problems within minutes of posting.",
      author: "James Wilson",
      role: "Computer Science Major"
    },
    {
      quote: "I was struggling with calculus until I found this platform. The explanations I received were clearer than my textbook!",
      author: "Emma Rodriguez",
      role: "Engineering Student"
    }
  ]

  return (
    <section id="testimonials" className="py-24 md:py-32 flex justify-center">
      <div className="container">
        <div className="flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mx-auto mb-16">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">What Our Users Say</h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Hear from students and educators who have transformed their learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/40 mb-4" />
                  <p className="text-lg mb-6 italic">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 