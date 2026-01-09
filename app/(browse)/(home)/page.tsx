import { handleUser } from "@/lib/auth-service";
import { Result, ResultSkeleton } from "./_components/result";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
async function Home() {
  handleUser();
  return (
    <div className="h-full p-8 max-w-screen-3xl mx-auto bg-theme">
      <Suspense fallback={<ResultSkeleton />}>
        <Result />
      </Suspense>
    </div>
  );
}
export default Home;
