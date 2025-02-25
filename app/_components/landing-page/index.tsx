import { Header } from "./header"
import { Hero } from "./hero"
import { Stats } from "./stats"
import { Features } from "./features"
import { HowItWorks } from "./how-it-works"
import { Testimonials } from "./testimonials"
import { CTA } from "./cta"
import { Footer } from "./footer"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
} 