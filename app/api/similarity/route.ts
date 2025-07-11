import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { sentence1, sentence2 } = await req.json()

  const qaServiceUrl = process.env.SIMILARITY_API_URL || "http://localhost:8000"
  const response = await fetch(`${qaServiceUrl}/similarity`, {
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
