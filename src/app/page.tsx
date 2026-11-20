import { Suspense } from "react";
import { CatalogExperience } from "@/components/CatalogExperience";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone font-mono text-xs text-pewter">
          LOADING ATELIER KINETA GALLERY...
        </div>
      }
    >
      <CatalogExperience />
    </Suspense>
  );
}
