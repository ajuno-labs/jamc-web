import { Header } from "./header"
import { Hero } from "./hero"
import { Features } from "./features"
import { HowItWorks } from "./how-it-works"
import { CTA } from "./cta"
import { Footer } from "./footer"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  )
} 