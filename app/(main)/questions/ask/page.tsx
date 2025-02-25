import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { QuestionForm } from "./_components/question-form"
import { getTags } from "../_actions/tags"

export default async function AskQuestionPage() {
  // Check if user is authenticated
  const session = await auth()
  
  if (!session?.user) {
    // Redirect to sign in page if not authenticated
    redirect("/signin")
  }
  
  // Fetch tags for the form
  const tags = await getTags()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ask a Question</h1>
      <QuestionForm tags={tags} />
    </div>
  )
} 