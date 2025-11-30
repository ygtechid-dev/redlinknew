"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Sparkles,
  Lock,
  CheckCircle2,
  Clock,
  Copy,
  Zap,
  Wand2,
  ShoppingBag,
  Check,
} from "lucide-react";

interface Page {
  id: string;
  username: string;
  page_name: string;
  page_slug: string;
  page_data: any;
  template_type: "auto" | "custom";
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  published_at?: string;
}

interface Block {
  id: string;
  title: string;
  block_type: string;
  price?: number;
  description?: string;
  image_url?: string;
}

export default function RedlinkWebBuilderLanding() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [products, setProducts] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [projectName, setProjectName] = useState("");

  // Modal states
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"auto" | "custom" | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const FREE_LIMIT = 5;
  const canCreateMore = pages.length < FREE_LIMIT;

  useEffect(() => {
    const u = localStorage.getItem("username");
    if (!u) {
      setLoading(false);
      return;
    }
    setUsername(u);
    fetchData(u);
  }, []);

  const fetchData = async (u: string) => {
    setLoading(true);
    try {
      // Get pages
      const { data: pagesData, error: pagesError } = await supabase
        .from("builder_pages")
        .select("*")
        .eq("username", u)
        .order("created_at", { ascending: false });

      if (pagesError) throw pagesError;
      setPages(pagesData || []);

      // Get digital products from blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from("blocks")
        .select("*")
        .eq("username", u)
        .eq("block_type", "product")
        .order("created_at", { ascending: false });

      if (blocksError) throw blocksError;
      setProducts(blocksData || []);
    } catch (err) {
      console.error("❌ Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openTemplateModal = () => {
    if (!projectName.trim()) return alert("Isi nama project dulu.");
    if (!canCreateMore) {
      return alert(
        `❌ Limit tercapai!\n\nKamu hanya bisa membuat ${FREE_LIMIT} landing pages.`
      );
    }
    setShowTemplateModal(true);
    setSelectedTemplate(null);
    setSelectedProductIds([]);
  };

  const handleTemplateSelect = (template: "auto" | "custom") => {
    setSelectedTemplate(template);
    
    // Auto select all products when choosing auto template
    if (template === "auto") {
      setSelectedProductIds(products.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const selectAllProducts = () => {
    setSelectedProductIds(products.map(p => p.id));
  };

  const deselectAllProducts = () => {
    setSelectedProductIds([]);
  };

  const generateAutoTemplate = (selectedProducts: Block[]) => {
    const elements = [];

    // Hero Section
    elements.push({
      id: `el_${Date.now()}_hero`,
      type: "heading",
      content: "Digital Products",
      styles: {
        fontSize: "48px",
        fontWeight: "bold",
        color: "#1a1a1a",
        textAlign: "center",
        margin: "40px 0 20px 0",
      },
    });

    elements.push({
      id: `el_${Date.now()}_subheader`,
      type: "text",
      content: "Pilih produk digital terbaik untuk kebutuhan Anda",
      styles: {
        fontSize: "18px",
        color: "#6b7280",
        textAlign: "center",
        margin: "0 0 40px 0",
      },
    });

    // Add each selected product
    selectedProducts.forEach((product, index) => {
      // Product Image
      if (product.image_url) {
        elements.push({
          id: `el_${Date.now()}_img_${index}`,
          type: "image",
          content: product.image_url,
          styles: {
            borderRadius: "16px",
            margin: "40px auto 20px auto",
            maxWidth: "500px",
          },
        });
      }

      // Product Title
      elements.push({
        id: `el_${Date.now()}_title_${index}`,
        type: "heading",
        content: product.title,
        styles: {
          fontSize: "32px",
          fontWeight: "bold",
          color: "#1f2937",
          textAlign: "center",
          margin: "20px 0 10px 0",
        },
      });

      // Product Description
      if (product.description) {
        elements.push({
          id: `el_${Date.now()}_desc_${index}`,
          type: "text",
          content: product.description,
          styles: {
            fontSize: "16px",
            color: "#4b5563",
            textAlign: "center",
            margin: "0 auto 20px auto",
            maxWidth: "600px",
          },
        });
      }

      // Product Price
      elements.push({
        id: `el_${Date.now()}_price_${index}`,
        type: "heading",
        content: `Rp ${product.price?.toLocaleString("id-ID")}`,
        styles: {
          fontSize: "36px",
          fontWeight: "bold",
          color: "#ef4444",
          textAlign: "center",
          margin: "20px 0",
        },
      });

      // Buy Button
      elements.push({
        id: `el_${Date.now()}_btn_${index}`,
        type: "button",
        content: "BELI SEKARANG",
        styles: {
          fontSize: "18px",
          fontWeight: "700",
          color: "#ffffff",
          backgroundColor: "#ef4444",
          padding: "16px 48px",
          borderRadius: "12px",
          textAlign: "center",
          margin: "20px auto 60px auto",
        },
      });

      // Spacer between products
      if (index < selectedProducts.length - 1) {
        elements.push({
          id: `el_${Date.now()}_spacer_${index}`,
          type: "spacer",
          content: "",
          styles: {
            height: "60px",
            margin: "0",
          },
        });
      }
    });

    return elements;
  };

  const createNewLandingPage = async () => {
    if (!selectedTemplate) return;

    // Validate product selection for auto template
    if (selectedTemplate === "auto" && selectedProductIds.length === 0) {
      return alert("❌ Pilih minimal 1 produk untuk auto-generate!");
    }

    setCreating(true);
    try {
      const slug = projectName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      let pageData = { elements: [] };

      // Generate auto template from selected products
      if (selectedTemplate === "auto") {
        const selectedProducts = products.filter(p => 
          selectedProductIds.includes(p.id)
        );
        pageData = { elements: generateAutoTemplate(selectedProducts) };
      }

      const { data: newPage, error: dbError } = await supabase
        .from("builder_pages")
        .insert([
          {
            username,
            page_name: projectName.trim(),
            page_slug: `${slug}-${Date.now()}`,
            page_data: pageData,
            template_type: selectedTemplate,
            status: "draft",
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      setPages((prev) => [newPage, ...prev]);
      setProjectName("");
      setShowTemplateModal(false);
      setSelectedTemplate(null);
      setSelectedProductIds([]);

      // Redirect to builder
      if (selectedTemplate === "custom") {
        alert("✅ Blank canvas berhasil dibuat!");
      } else {
        alert(
          `✅ Landing page auto-generated dari ${selectedProductIds.length} produk!`
        );
      }
      
      router.push(`/builder?id=${newPage.id}`);
    } catch (err: any) {
      console.error("❌ Gagal membuat landing page:", err);
      alert(`Gagal membuat landing page: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handlePublishPage = async (page: Page) => {
    try {
      const { error } = await supabase
        .from("builder_pages")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
        })
        .eq("id", page.id);

      if (error) throw error;

      fetchData(username!);
      alert("✅ Landing page berhasil dipublish!");
    } catch (err: any) {
      console.error("❌ Gagal publish:", err);
      alert(`Gagal publish: ${err.message}`);
    }
  };

  const handleDeletePage = async (page: Page) => {
    const confirm = window.confirm(
      `Yakin mau hapus landing page "${page.page_name}"?`
    );
    if (!confirm) return;

    try {
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

  const getPublicUrl = (page: Page) => {
    return `${window.location.origin}/web/${page.page_slug}`;
  };

  const copyUrl = (page: Page) => {
    const url = getPublicUrl(page);
    navigator.clipboard.writeText(url);
    alert("✅ URL berhasil dicopy!");
  };

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
                Buat landing page dengan mudah
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Hi, {username}!</p>
              {products.length > 0 && (
                <p className="text-xs text-green-600 font-semibold">
                  {products.length} digital product tersedia
                </p>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Landing Pages</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {pages.length}
                  <span className="text-lg text-gray-400 ml-2">
                    / {FREE_LIMIT}
                  </span>
                </h2>
              </div>
              {pages.length >= FREE_LIMIT && (
                <div className="text-right">
                  <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-xs text-red-600 font-semibold">
                    Limit Reached
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Create New Page */}
     <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
    <Plus className="w-5 h-5 text-red-500" />
    Buat Landing Page Baru
  </h2>

  <div className="flex flex-col sm:flex-row gap-3">
    <input
      type="text"
      value={projectName}
      onChange={(e) => setProjectName(e.target.value)}
      placeholder="Masukkan nama project (contoh: Promo Ramadan)"
      className="flex-1 border rounded-lg px-4 py-2 text-sm text-black placeholder:text-gray-400"
      disabled={!canCreateMore}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !creating && canCreateMore) {
          openTemplateModal();
        }
      }}
    />

    <button
      onClick={openTemplateModal}
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
      ⚠️ Kamu sudah mencapai limit {FREE_LIMIT} pages.
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
                        {page.template_type === "auto" && (
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Auto
                          </span>
                        )}
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
                          /web/{page.page_slug}
                        </span>
                        <button
                          onClick={() => copyUrl(page)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Copy URL"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => router.push(`/builder?id=${page.id}`)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Edit
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
                          href={getPublicUrl(page)}
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

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b z-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Pilih Template
              </h2>
              <p className="text-gray-600">
                Bagaimana cara kamu mau buat landing page?
              </p>
            </div>

            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* Auto Template */}
                <button
                  onClick={() => handleTemplateSelect("auto")}
                  disabled={products.length === 0}
                  className={`border-2 rounded-xl p-6 text-left transition ${
                    selectedTemplate === "auto"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  } ${products.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Auto Generate</h3>
                      <p className="text-xs text-gray-500">Instant & Easy</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Otomatis generate landing page dari digital products yang ada
                    di My Redlink
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full font-semibold ${
                      products.length > 0 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {products.length} products
                    </span>
                    {products.length === 0 && (
                      <span className="text-red-500">Buat product dulu!</span>
                    )}
                  </div>
                </button>

                {/* Custom Template */}
                <button
                  onClick={() => handleTemplateSelect("custom")}
                  className={`border-2 rounded-xl p-6 text-left transition ${
                    selectedTemplate === "custom"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                      <Wand2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Custom Builder</h3>
                      <p className="text-xs text-gray-500">Full Control</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Buat landing page dari nol dengan drag & drop builder
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                      Full customization
                    </span>
                  </div>
                </button>
              </div>

              {/* Product Selection (only show for auto template) */}
              {selectedTemplate === "auto" && products.length > 0 && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-purple-600" />
                      Pilih Produk ({selectedProductIds.length}/{products.length})
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllProducts}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Pilih Semua
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={deselectAllProducts}
                        className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                      >
                        Batal Semua
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 max-h-60 overflow-y-auto">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => toggleProductSelection(product.id)}
                        className={`border-2 rounded-xl p-4 text-left transition flex items-center gap-4 ${
                          selectedProductIds.includes(product.id)
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {/* Checkbox */}
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                          selectedProductIds.includes(product.id)
                            ? "bg-purple-500 border-purple-500"
                            : "border-gray-300"
                        }`}>
                          {selectedProductIds.includes(product.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {/* Product Image */}
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}

                        {/* Product Info */}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {product.title}
                          </h4>
                          <p className="text-sm text-red-600 font-semibold">
                            Rp {product.price?.toLocaleString("id-ID")}
                          </p>
                          {product.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedProductIds.length === 0 && (
                    <p className="text-red-500 text-sm mt-3 text-center">
                      ⚠️ Pilih minimal 1 produk untuk auto-generate
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white p-6 border-t flex gap-3">
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                  setSelectedProductIds([]);
                }}
                className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-3 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={createNewLandingPage}
                disabled={
                  !selectedTemplate || 
                  creating || 
                  (selectedTemplate === "auto" && selectedProductIds.length === 0)
                }
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg py-3 font-semibold hover:opacity-90 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Page
                    {selectedTemplate === "auto" && selectedProductIds.length > 0 && (
                      <span className="ml-2 text-xs opacity-80">
                        ({selectedProductIds.length} produk)
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}