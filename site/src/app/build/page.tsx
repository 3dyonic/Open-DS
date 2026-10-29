import { Suspense } from "react";
import { BuildForm } from "@/app/build/build-form";

export default function BuildPage() {
  return (
    <Suspense fallback={<p>Loading the builder.</p>}>
      <BuildForm />
    </Suspense>
  );
}
