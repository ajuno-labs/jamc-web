import { auth } from "@/auth"
import { prisma } from "@/lib/db/prisma"
import { slugify } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"
import { QuestionType } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, content, tags, courseId, lessonId, type = QuestionType.STRUCTURED, visibility = "PUBLIC", topic } = body

    // Create a unique slug from the title
    const baseSlug = slugify(title)
    let slug = baseSlug
    let counter = 1

    // Check if slug exists and generate a unique one if needed
    while (await prisma.question.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create the question
    const question = await prisma.question.create({
      data: {
        title,
        content,
        slug,
        type,
        visibility,
        topic,
        authorId: session.user.id,
        courseId,
        lessonId,
        tags: {
          connect: tags?.map((tag: string) => ({ id: tag })) || [],
        },
      },
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error("[QUESTIONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
