import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { query, topK = 5, threshold = 0.5 } = await req.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const semanticSearchUrl = process.env.SIMILARITY_API_URL || "http://localhost:8000"
    const response = await fetch(`${semanticSearchUrl}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        top_k: topK,
        threshold
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Semantic search API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Similarity API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
