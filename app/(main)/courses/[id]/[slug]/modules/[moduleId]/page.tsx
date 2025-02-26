import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getModuleById } from "../../../../_actions/module-actions"
import { auth } from "@/auth"
import { ModuleNavigation } from "./components/module-navigation"
import { ModuleActions } from "./components/module-actions"
import { ModuleContent } from "./components/module-content"
import { ModuleNavigationButtons } from "./components/module-navigation-buttons"
import { RelatedQuestions } from "./components/related-questions"

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { id: string; slug: string; moduleId: string }
}): Promise<Metadata> {
  const moduleData = await getModuleById(params.moduleId, params.id)
  
  if (!moduleData) {
    return {
      title: "Module Not Found",
      description: "The requested module could not be found.",
    }
  }
  
  return {
    title: `${moduleData.title} | ${moduleData.course.title}`,
    description: moduleData.content.substring(0, 160),
  }
}

export default async function ModuleDetailPage({
  params,
}: {
  params: { id: string; slug: string; moduleId: string }
}) {
  const moduleData = await getModuleById(params.moduleId, params.id)
  
  if (!moduleData) {
    notFound()
  }
  
  // Verify that the slug matches the course slug
  if (moduleData.course.slug !== params.slug) {
    notFound()
  }
  
  // Get current user session
  const session = await auth()
  const userId = session?.user?.id
  
  // Find current module index and adjacent modules
  const currentIndex = moduleData.course.modules.findIndex(m => m.id === moduleData.id)
  const prevModule = currentIndex > 0 ? moduleData.course.modules[currentIndex - 1] : null
  const nextModule = currentIndex < moduleData.course.modules.length - 1 ? moduleData.course.modules[currentIndex + 1] : null
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href={`/courses/${moduleData.course.id}/${moduleData.course.slug}`}
          className="text-sm text-muted-foreground hover:text-primary flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to {moduleData.course.title}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{moduleData.title}</h1>
          <p className="text-muted-foreground mb-6">Module {currentIndex + 1} of {moduleData.course.modules.length}</p>
          
          {/* Module content */}
          <ModuleContent content={moduleData.content} />
          
          {/* Navigation between modules */}
          <ModuleNavigationButtons 
            prevModule={prevModule}
            nextModule={nextModule}
            courseId={moduleData.course.id}
            courseSlug={moduleData.course.slug}
          />
          
          {/* Related questions */}
          <RelatedQuestions 
            questions={moduleData.questions}
            moduleId={moduleData.id}
            courseId={moduleData.course.id}
          />
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Module Navigation */}
          <ModuleNavigation 
            modules={moduleData.course.modules}
            currentModuleId={moduleData.id}
            courseId={moduleData.course.id}
            courseSlug={moduleData.course.slug}
          />
          
          {/* Module Actions */}
          <ModuleActions 
            moduleId={moduleData.id}
            courseId={moduleData.course.id}
            userId={userId}
          />
        </div>
      </div>
    </div>
  )
} 