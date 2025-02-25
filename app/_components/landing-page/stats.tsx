export function Stats() {
  return (
    <section className="border-t border-b bg-muted/40 flex justify-center">
      <div className="container py-12 md:py-16 flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center w-full max-w-[58rem]">
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
  )
} 