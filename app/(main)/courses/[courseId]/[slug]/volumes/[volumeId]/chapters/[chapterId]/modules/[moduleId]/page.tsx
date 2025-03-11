import { notFound } from "next/navigation"
import { getModule } from "./_actions/get-module"
import { ModuleHeader } from "./_components/module-header"
import { ModuleContent } from "./_components/module-content"

interface ModulePageProps {
  params: {
    moduleId: string
    courseId: string
    volumeId: string
    chapterId: string
  }
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleId, courseId, volumeId, chapterId } = params
  
  const { module, isEnrolled } = await getModule(moduleId)
  
  if (!module) {
    notFound()
  }

  return (
    <div className="container py-6 space-y-8">
      <ModuleHeader
        title={module.title}
        content={module.content}
        courseId={courseId}
        volumeId={volumeId}
        chapterId={chapterId}
      />
      
      <ModuleContent
        lessons={module.lessons}
        courseId={courseId}
        volumeId={volumeId}
        chapterId={chapterId}
        moduleId={moduleId}
        isEnrolled={isEnrolled}
      />
    </div>
  )
} 