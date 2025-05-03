import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { sentence1, sentence2 } = await req.json()

  // Forward request to the QA-service FastAPI backend
  const response = await fetch("http://localhost:8000/similarity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence1, sentence2 }),
  })

  if (!response.ok) {
    return new NextResponse("Error forwarding to similarity service", { status: response.status })
  }

  const data: { similarity: number } = await response.json()
  return NextResponse.json(data)
} 