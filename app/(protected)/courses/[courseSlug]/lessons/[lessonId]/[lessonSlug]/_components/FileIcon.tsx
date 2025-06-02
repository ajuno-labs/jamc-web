import { FileText } from "lucide-react"

interface FileIconProps {
  fileType: string
}

export default function FileIcon({ fileType }: FileIconProps) {
  const getIconColor = () => {
    switch (fileType) {
      case "pdf":
        return "text-red-500"
      case "zip":
        return "text-yellow-500"
      case "pptx":
        return "text-orange-500"
      case "docx":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className={`h-8 w-8 rounded flex items-center justify-center ${getIconColor()} bg-accent`}>
      <FileText className="h-4 w-4" />
    </div>
  )
} 