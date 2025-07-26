import { ArrowRight } from "lucide-react"

export function StepArrow() {
  return (
    <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-border">
      <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}