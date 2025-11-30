// 📁 app/web-builder/page.tsx
// Dashboard untuk manage landing pages

import RedlinkWebBuilderLanding from "@/components/RedlinkWebBuilderLanding";

export const metadata = {
  title: "Landing Page Builder - RedLink",
  description: "Buat landing page dengan drag & drop builder",
};

export default function WebBuilderPage() {
  return <RedlinkWebBuilderLanding />;
}