"use client";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  Edit,
  Eye,
  Globe,
  Loader2,
  Lock,
  Plus,
  Sparkles,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";

interface Page {
  id: string;
  username: string;
  page_name: string;
  page_slug: string;
  page_data: any;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export default function RedlinkWebBuilderLanding() {
  const [username, setUsername] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [projectName, setProjectName] = useState("");
  
  // State untuk editor modal
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Page limits
  const FREE_LIMIT = 5;
  const isPro = profile?.plan === "Pro";
  const canCreateMore = isPro || pages.length < FREE_LIMIT;

  useEffect(() => {
    const u = localStorage.getItem("username");
    if (!u) {
      setLoading(false);
      return;
    }
    setUsername(u);
    fetchData(u);
  }, []);

  // Ambil profile dan pages
  const fetchData = async (u: string) => {
    setLoading(true);
    try {
      // Get profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("username, plan, balance")
        .eq("username", u)
        .maybeSingle();
      setProfile(prof);

      // Get pages dari database
      const { data: pagesData, error } = await supabase
        .from("builder_pages")
        .select("*")
        .eq("username", u)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPages(pagesData || []);
    } catch (err) {
      console.error("❌ Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Buat landing page baru
  const createNewLandingPage = async () => {
    if (!username) return alert("Username belum ditemukan.");
    if (!projectName.trim()) return alert("Isi nama project dulu.");

    // Check limit
    if (!canCreateMore) {
      return alert(
        `❌ Limit tercapai!\n\nAkun Free hanya bisa membuat ${FREE_LIMIT} landing pages.\nUpgrade ke Pro untuk unlimited pages!`
      );
    }

    setCreating(true);
    try {
      // Generate slug dari nama
      const slug = projectName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Save to database
      const { data: newPage, error: dbError } = await supabase
        .from("builder_pages")
        .insert([
          {
            username,
            page_name: projectName.trim(),
            page_slug: `${username}-${slug}`,
            page_data: { elements: [] }, // Empty page
            status: 'draft',
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      setPages((prev) => [newPage, ...prev]);
      setProjectName("");
      
      alert(`✅ Landing page '${projectName}' berhasil dibuat!`);

      // Auto-open editor in modal
      setSelectedPage(newPage);
      setShowEditor(true);
    } catch (err: any) {
      console.error("❌ Gagal membuat landing page:", err);
      alert(`Gagal membuat landing page: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  // Open editor in modal
  const openEditor = (page: Page) => {
    setSelectedPage(page);
    setShowEditor(true);
  };

  // Close editor modal
  const closeEditor = () => {
    setShowEditor(false);
    setSelectedPage(null);
    // Refresh data setelah close
    if (username) fetchData(username);
  };

  // Handle save from modal
  const handleEditorSave = async (pageData: any) => {
    console.log("💾 Page saved:", pageData);
    // Refresh data
    if (username) await fetchData(username);
  };

  // Publish page
  const handlePublishPage = async (page: Page) => {
    try {
      // Update database
      const { error } = await supabase
        .from("builder_pages")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
        })
        .eq("id", page.id);

      if (error) throw error;

      // Refresh data
      if (username) fetchData(username);
      
      alert("✅ Landing page berhasil dipublish!");
    } catch (err: any) {
      console.error("❌ Gagal publish:", err);
      alert(`Gagal publish: ${err.message}`);
    }
  };

  // Delete page
  const handleDeletePage = async (page: Page) => {
    const confirm = window.confirm(
      `Yakin mau hapus landing page "${page.page_name}"?`
    );
    if (!confirm) return;

    try {
      // Delete from database
      const { error } = await supabase
        .from("builder_pages")
        .delete()
        .eq("id", page.id);

      if (error) throw error;

      setPages((prev) => prev.filter((p) => p.id !== page.id));
      alert("✅ Landing page berhasil dihapus!");
    } catch (err: any) {
      console.error("❌ Gagal hapus:", err);
      alert(`Gagal hapus: ${err.message}`);
    }
  };

  // Duplicate page
  const handleDuplicatePage = async (page: Page) => {
    if (!canCreateMore) {
      return alert(
        `❌ Limit tercapai!\n\nAkun Free hanya bisa membuat ${FREE_LIMIT} landing pages.`
      );
    }

    try {
      const { data: newPage, error } = await supabase
        .from("builder_pages")
        .insert([
          {
            username: page.username,
            page_name: `${page.page_name} (Copy)`,
            page_slug: `${page.page_slug}-copy-${Date.now()}`,
            page_data: page.page_data,
            status: 'draft',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPages((prev) => [newPage, ...prev]);
      alert("✅ Landing page berhasil diduplikasi!");
    } catch (err: any) {
      console.error("❌ Gagal duplikasi:", err);
      alert(`Gagal duplikasi: ${err.message}`);
    }
  };

  // Get preview URL
  const getPreviewUrl = (page: Page) => {
    return `${window.location.origin}/preview/${page.page_slug}`;
  };

  // Copy preview URL
  const copyPreviewUrl = (page: Page) => {
    const url = getPreviewUrl(page);
    navigator.clipboard.writeText(url);
    alert("✅ URL berhasil dicopy!");
  };

  // ========================== UI ==========================

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );

  if (!username)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">❌ Tidak ada username di localStorage</p>
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-100/70 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-red-500" />
                Landing Page Builder
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Drag & Drop Visual Builder
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Hi, {username}!</p>
              <div className="flex items-center gap-2 mt-1">
                {isPro ? (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" /> PRO
                  </span>
                ) : (
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                    FREE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Landing Pages</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {pages.length}
                  {!isPro && (
                    <span className="text-lg text-gray-400 ml-2">
                      / {FREE_LIMIT}
                    </span>
                  )}
                </h2>
              </div>
              {!isPro && pages.length >= FREE_LIMIT && (
                <div className="text-right">
                  <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-xs text-red-600 font-semibold">
                    Limit Reached
                  </p>
                  <button className="mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90">
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </div>

            {!isPro && (
              <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  💡 <strong>Upgrade ke Pro</strong> untuk unlimited landing
                  pages, custom domain, dan fitur premium lainnya!
                </p>
              </div>
            )}
          </div>

          {/* Create New Page */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-red-500" />
              Buat Landing Page Baru
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Masukkan nama project (contoh: Promo Ramadan)"
                className="flex-1 border rounded-lg px-4 py-2 text-sm"
                disabled={!canCreateMore}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !creating && canCreateMore) {
                    createNewLandingPage();
                  }
                }}
              />
              <button
                onClick={createNewLandingPage}
                disabled={creating || !canCreateMore}
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Buat Page
                  </>
                )}
              </button>
            </div>
            {!canCreateMore && (
              <p className="text-red-500 text-sm mt-2">
                ⚠️ Kamu sudah mencapai limit {FREE_LIMIT} pages untuk akun Free.
                Upgrade ke Pro untuk unlimited!
              </p>
            )}
          </div>

          {/* Pages List */}
          <div className="space-y-4">
            {pages.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-200">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Belum ada landing page dibuat.
                  <br />
                  Klik tombol di atas untuk membuat yang pertama!
                </p>
              </div>
            ) : (
              pages.map((page) => (
                <div
                  key={page.id}
                  className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-800 text-lg">
                          {page.page_name}
                        </h3>
                        {page.status === "published" ? (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Draft
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(page.created_at).toLocaleDateString("id-ID")}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          /{page.page_slug}
                        </span>
                        <button
                          onClick={() => copyPreviewUrl(page)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Copy preview URL"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {/* Edit in Modal */}
                      <button
                        onClick={() => openEditor(page)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicatePage(page)}
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition flex items-center gap-1"
                        title="Duplicate page"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {page.status === "draft" && (
                        <button
                          onClick={() => handlePublishPage(page)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-1"
                        >
                          <Globe className="w-4 h-4" /> Publish
                        </button>
                      )}

                      {page.status === "published" && (
                        <a
                          href={getPreviewUrl(page)}
                          target="_blank"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" /> View
                        </a>
                      )}

                      <button
                        onClick={() => handleDeletePage(page)}
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Builder Editor Modal */}
      {/* {showEditor && selectedPage && (
        <BuilderEditorModal
          page={selectedPage}
          onClose={closeEditor}
          onSave={handleEditorSave}
        />
      )} */}
    </>
  );
}