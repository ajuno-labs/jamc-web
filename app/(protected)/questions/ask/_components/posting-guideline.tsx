import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostingGuideline() {
    return (
    <Card className="mt-6">
    <CardHeader>
      <CardTitle>Posting Guidelines</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start">
          <span role="img" aria-label="light bulb" className="mr-2">💡</span>
          Be specific and clear about your question
        </li>
        <li className="flex items-start">
          <span role="img" aria-label="information" className="mr-2">ℹ️</span>
          Include all relevant details and context
        </li>
        <li className="flex items-start">
          <span role="img" aria-label="formatting" className="mr-2">🔤</span>
          Use proper formatting for code or equations
        </li>
        <li className="flex items-start">
          <span role="img" aria-label="search" className="mr-2">🔍</span>
          Check for similar questions before posting
        </li>
        <li className="flex items-start">
          <span role="img" aria-label="tag" className="mr-2">🏷️</span>
          Tag your question appropriately
        </li>
      </ul>
    </CardContent>
  </Card>
  )
}