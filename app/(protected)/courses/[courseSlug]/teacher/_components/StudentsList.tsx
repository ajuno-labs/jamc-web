import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StudentsList() {
  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.j@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
      progress: 78,
      questionsAsked: 5,
      lastActive: "Today",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Miller",
      email: "sarah.m@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
      progress: 92,
      questionsAsked: 3,
      lastActive: "Yesterday",
      status: "active",
    },
    {
      id: 3,
      name: "David Chen",
      email: "david.c@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DC",
      progress: 45,
      questionsAsked: 8,
      lastActive: "2 days ago",
      status: "at-risk",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily.w@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EW",
      progress: 67,
      questionsAsked: 2,
      lastActive: "Today",
      status: "active",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.b@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MB",
      progress: 23,
      questionsAsked: 0,
      lastActive: "1 week ago",
      status: "inactive",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>
            <Button variant="ghost" size="sm" className="gap-1 font-medium">
              Progress
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </TableHead>
          <TableHead>Questions</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback>{student.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-xs text-muted-foreground">{student.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={student.progress} className="h-2 w-24" />
                <span className="text-xs font-medium">{student.progress}%</span>
              </div>
            </TableCell>
            <TableCell>{student.questionsAsked}</TableCell>
            <TableCell>{student.lastActive}</TableCell>
            <TableCell>
              {student.status === "active" && <Badge className="bg-green-500">Active</Badge>}
              {student.status === "at-risk" && <Badge variant="destructive">At Risk</Badge>}
              {student.status === "inactive" && <Badge variant="outline">Inactive</Badge>}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                  <DropdownMenuItem>View Questions</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
