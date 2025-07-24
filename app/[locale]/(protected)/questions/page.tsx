"use client";

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { searchQuestions } from "@/lib/actions/search-actions";
import { QuestionType } from "@prisma/client";
import { QuestionSearch } from "./components/question-search";
import { QuestionCard } from "./components/question-card";
import { QuestionPagination } from "./components/question-pagination";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useTranslations } from "next-intl";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  content: string;
  type: QuestionType;
  author: {
    name: string | null;
    image: string | null;
  };
  tags: Array<{ name: string }>;
  answerCount: number;
  voteCount: number;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function QuestionsPage() {
  const t = useTranslations("QuestionsPage");
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedType, setSelectedType] = React.useState<"all" | QuestionType>("all");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);

  /**
   * Fetch questions based on the current filters and the page that should be displayed.
   *
   * NOTE: This function **must not** depend on `currentPage` otherwise its reference
   * will change every time we navigate, triggering effects that reset the page back
   * to 1. Instead, the page to fetch is passed explicitly as an argument.
   */
  const performSearch = React.useCallback(
    async (pageToFetch: number) => {
      setIsLoading(true);
      try {
        const result = await searchQuestions(
          debouncedQuery,
          selectedType,
          pageToFetch,
          ITEMS_PER_PAGE,
          selectedTags
        );

        setResults(result.items);
        setTotal(result.total);
        setHasMore(result.hasMore ?? pageToFetch * ITEMS_PER_PAGE < result.total);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedQuery, selectedType, selectedTags]
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, selectedType, selectedTags]);

  React.useEffect(() => {
    performSearch(currentPage);
  }, [performSearch, currentPage]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/questions/ask">{t("askQuestion")}</Link>
        </Button>
      </div>

      <div className="mb-8">
        <QuestionSearch
          query={query}
          onQueryChange={setQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />
      </div>

      <div className="space-y-4">
        {isLoading && currentPage === 1 ? (
          <div className="text-center py-8">{t("loading")}</div>
        ) : results.length === 0 ? (
          <div className="text-center py-8">
            {query || selectedTags.length > 0 ? t("noQuestionsFound") : t("noQuestionsYet")}
          </div>
        ) : (
          <>
            {results.map((question) => (
              <QuestionCard key={question.id} {...question} />
            ))}

            <QuestionPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasMore={hasMore}
              onPageChange={setCurrentPage}
              totalItems={total}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </>
        )}
      </div>
    </div>
  );
}
