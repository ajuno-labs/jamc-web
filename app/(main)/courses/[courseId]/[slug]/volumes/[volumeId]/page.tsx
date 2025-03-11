import { getVolume } from "./_actions/get-volume"
import { VolumeHeader } from "./_components/volume-header"
import { VolumeContent } from "./_components/volume-content"
import { CourseRelatedQuestions } from "@/components/course-related-questions"

interface VolumePageProps {
  params: {
    courseId: string
    volumeId: string
  }
}

export default async function VolumePage({ params }: VolumePageProps) {
  const { volume, isEnrolled } = await getVolume(params.volumeId)

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <VolumeHeader
            title={volume.title}
            overview={volume.overview}
            courseId={volume.courseId}
          />
          <VolumeContent
            chapters={volume.chapters}
            courseId={volume.courseId}
            volumeId={volume.id}
            isEnrolled={isEnrolled}
          />
        </div>
        <div className="space-y-6">
          <CourseRelatedQuestions
            courseId={volume.courseId}
            volumeId={volume.id}
          />
        </div>
      </div>
    </div>
  )
} 