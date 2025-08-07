import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function PostingGuideline() {
    const t = useTranslations('AskQuestionPage.QuestionForm.guidelines');
    
    return (
    <Card>
    <CardHeader>
      <CardTitle>{t('title')}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start">
          <span role="img" aria-label="light bulb" className="mr-2">💡</span>
          {t('beSpecific')}
        </li>
        <li className="flex items-start">
          <span role="img" aria-label="information" className="mr-2">ℹ️</span>
          {t('includeDetails')}
        </li>
        <li className="flex items-start">
          <span role="img" aria-label="formatting" className="mr-2">🔤</span>
          {t('useFormatting')}
        </li>
        <li className="flex items-start">
          <span role="img" aria-label="search" className="mr-2">🔍</span>
          {t('checkSimilar')}
        </li>
        <li className="flex items-start">
          <span role="img" aria-label="tag" className="mr-2">🏷️</span>
          {t('tagAppropriately')}
        </li>
      </ul>
    </CardContent>
  </Card>
  )
}
