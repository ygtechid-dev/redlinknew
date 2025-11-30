"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart } from "lucide-react";

interface Element {
  id: string;
  type: "heading" | "text" | "button" | "image" | "spacer";
  content: string;
  styles: Record<string, string>;
}

export default function PublicLandingPage({ slug }: { slug: string }) {
  const [elements, setElements] = useState<Element[]>([]);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      // Get page
      const { data: page, error } = await supabase
        .from("builder_pages")
        .select("*")
        .eq("page_slug", slug)
        .eq("status", "published")
        .single();

      if (error || !page) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setElements(page.page_data?.elements || []);

      // Get creator's affiliate link
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", page.username)
        .maybeSingle();

      if (profile) {
        // Affiliate link dengan format: redlink.id?ref=username
        setAffiliateLink(`https://redlink.id/${profile.username}`);
      }
    } catch (err) {
      console.error("❌ Error loading page:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600">Landing page tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Landing Page Content */}
      <div className="max-w-4xl mx-auto p-8">
        {elements.map((element) => {
          if (element.type === "image") {
            return (
              <img
                key={element.id}
                src={element.content}
                alt="Element"
                style={element.styles}
                className="block"
              />
            );
          }

          if (element.type === "spacer") {
            return <div key={element.id} style={element.styles} />;
          }

          if (element.type === "button") {
            return (
              <div key={element.id} style={element.styles}>
                {element.content}
              </div>
            );
          }

          if (element.type === "heading") {
            return (
              <h1 key={element.id} style={element.styles}>
                {element.content}
              </h1>
            );
          }

          return (
            <p key={element.id} style={element.styles}>
              {element.content}
            </p>
          );
        })}
      </div>

      {/* Auto Affiliate Buy Button - Fixed Bottom */}
      {affiliateLink && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 to-rose-600 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="text-white">
              <p className="font-bold">Tertarik dengan produk ini?</p>
              <p className="text-sm opacity-90">
                Dapatkan penawaran terbaik sekarang!
              </p>
            </div>
            <a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition flex items-center gap-2 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              BELI SEKARANG
            </a>
          </div>
        </div>
      )}

      {/* Spacer untuk button fixed */}
      <div className="h-24"></div>
    </div>
  );
}