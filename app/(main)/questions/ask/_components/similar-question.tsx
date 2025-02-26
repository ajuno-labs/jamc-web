import { AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SimilarQuestion({ similarQuestions }: { similarQuestions: string[] }) {
    return (          <Card>
        <CardHeader>
          <CardTitle>Similar Questions</CardTitle>
          <CardDescription>
            These questions might be related to yours. Check them out before posting!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {similarQuestions.map((question, index) => (
              <li key={index} className="flex items-start">
                <AlertCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <a href="#" className="text-primary hover:underline">
                  {question}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>)
}