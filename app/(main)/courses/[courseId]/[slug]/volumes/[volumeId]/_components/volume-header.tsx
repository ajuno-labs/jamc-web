import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface VolumeHeaderProps {
  title: string
  overview: string | null
}

export function VolumeHeader({ title, overview }: VolumeHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {overview && <CardDescription>{overview}</CardDescription>}
      </CardHeader>
    </Card>
  )
} 