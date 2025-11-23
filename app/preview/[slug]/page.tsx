import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import PreviewRenderer from '@/components/PreviewRenderer';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function PreviewPage({ params }: PageProps) {
  const { slug } = params;

  // Fetch page data
  const { data: page, error } = await supabase
    .from('builder_pages')
    .select('*')
    .eq('page_slug', slug)
    .single();

  if (error || !page) {
    notFound();
  }

  // Only show published pages (or in development mode show all)
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev && page.status !== 'published') {
    notFound();
  }

  return <PreviewRenderer page={page} />;
}

// Generate static params for published pages (optional)
export async function generateStaticParams() {
  const { data: pages } = await supabase
    .from('builder_pages')
    .select('page_slug')
    .eq('status', 'published');

  if (!pages) return [];

  return pages.map((page) => ({
    slug: page.page_slug,
  }));
}