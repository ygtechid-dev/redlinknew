// 📁 app/web/[slug]/page.tsx
// Public landing page viewer

import { supabase } from "@/lib/supabase";
import PublicLandingPage from "@/components/PublicLandingPage";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps) {
  const { data: page } = await supabase
    .from("builder_pages")
    .select("page_name, username")
    .eq("page_slug", params.slug)
    .eq("status", "published")
    .single();

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${page.page_name} - RedLink`,
    description: `Landing page by @${page.username}`,
  };
}

export default function PublicLandingPageRoute({ params }: PageProps) {
  return <PublicLandingPage slug={params.slug} />;
}

// Optional: Generate static params untuk published pages
export async function generateStaticParams() {
  const { data: pages } = await supabase
    .from("builder_pages")
    .select("page_slug")
    .eq("status", "published");

  return (pages || []).map((page) => ({
    slug: page.page_slug,
  }));
}