import { Suspense } from "react";
import Banner from "@/components/Banner"; // Adjust the import path as necessary
import { Results, ResultsSkeleton } from "./_components/results";

export default function Page() {
  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
      <Banner /> {/* Add the Banner component here */}
      <Suspense fallback={<ResultsSkeleton />}>
        <Results />
      </Suspense>
    </div>
  );
}
