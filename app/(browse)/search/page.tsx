import { redirect } from "next/navigation";
import { Results, ResultsSkeleton } from "./_components/result";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
interface SearchPageProps {
  searchParams: {
    term?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;

  if (!params.term) {
    redirect("/");
  }
  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
      <Suspense fallback={<ResultsSkeleton />}>
        <Results term={params.term} />
      </Suspense>
    </div>
  );
};

export default SearchPage;
