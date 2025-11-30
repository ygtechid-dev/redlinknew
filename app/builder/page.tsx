import { Suspense } from "react";
import BuilderPage from "@/components/BuilderPage";

export const metadata = {
  title: "Page Editor - RedLink Builder",
  description: "Drag & drop landing page editor",
};

export default function BuilderEditorPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <BuilderPage />
    </Suspense>
  );
}
