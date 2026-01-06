import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { handleUser } from "@/lib/auth-service";
import { Result, ResultSkeleton } from "./_components/result";
import { Suspense } from "react";

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
