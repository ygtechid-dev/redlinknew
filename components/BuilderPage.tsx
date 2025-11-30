"use client";
import { useEffect, useState, CSSProperties} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  Save,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  Type,
  Image as ImageIcon,
  Square,
  MousePointer,
  AlignLeft,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
} from "lucide-react";

interface Element {
  id: string;
  type: "heading" | "text" | "button" | "image" | "spacer";
  content: string;
  styles: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    textAlign?: string;
    height?: string;
  };
}

export default function BuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams?.get("id");

  const [username, setUsername] = useState<string | null>(null);
  const [pageName, setPageName] = useState("");
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem("username");
    setUsername(u);
    
    if (pageId) {
      loadPage();
    } else {
      setLoading(false);
    }
  }, [pageId]);

  const loadPage = async () => {
    try {
      const { data, error } = await supabase
        .from("builder_pages")
        .select("*")
        .eq("id", pageId)
        .single();

      if (error) throw error;

      setPageName(data.page_name);
      setElements(data.page_data?.elements || []);
    } catch (err) {
      console.error("❌ Error loading page:", err);
      alert("Gagal load page");
    } finally {
      setLoading(false);
    }
  };

  const generateId = () =>
    `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addElement = (type: Element["type"]) => {
    const templates: Record<Element["type"], Element> = {
      heading: {
        id: generateId(),
        type: "heading",
        content: "Heading Text",
        styles: {
          fontSize: "36px",
          fontWeight: "bold",
          color: "#1a1a1a",
          textAlign: "center",
          margin: "20px 0",
        },
      },
      text: {
        id: generateId(),
        type: "text",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        styles: {
          fontSize: "16px",
          color: "#4a5568",
          textAlign: "left",
          margin: "10px 0",
        },
      },
      button: {
        id: generateId(),
        type: "button",
        content: "Click Me",
        styles: {
          fontSize: "16px",
          fontWeight: "600",
          color: "#ffffff",
          backgroundColor: "#ef4444",
          padding: "12px 32px",
          borderRadius: "8px",
          textAlign: "center",
          margin: "20px auto",
        },
      },
      image: {
        id: generateId(),
        type: "image",
        content: "https://placehold.co/600x400/e5e7eb/1f2937?text=Your+Image",
        styles: {
          borderRadius: "8px",
          margin: "20px auto",
        },
      },
      spacer: {
        id: generateId(),
        type: "spacer",
        content: "",
        styles: {
          height: "40px",
          margin: "0",
        },
      },
    };

    const newElement = templates[type];
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const updateStyle = (id: string, key: string, value: string) => {
    setElements(
      elements.map((el) =>
        el.id === id ? { ...el, styles: { ...el.styles, [key]: value } } : el
      )
    );
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveElement = (id: string, direction: "up" | "down") => {
    const index = elements.findIndex((el) => el.id === id);
    if (index === -1) return;

    const newElements = [...elements];
    if (direction === "up" && index > 0) {
      [newElements[index - 1], newElements[index]] = [
        newElements[index],
        newElements[index - 1],
      ];
    } else if (direction === "down" && index < elements.length - 1) {
      [newElements[index], newElements[index + 1]] = [
        newElements[index + 1],
        newElements[index],
      ];
    }
    setElements(newElements);
  };

  const duplicateElement = (id: string) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    const duplicate = { ...element, id: generateId() };
    const index = elements.findIndex((el) => el.id === id);
    const newElements = [...elements];
    newElements.splice(index + 1, 0, duplicate);
    setElements(newElements);
  };

  const savePage = async () => {
    if (!pageId) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("builder_pages")
        .update({
          page_data: { elements },
          updated_at: new Date().toISOString(),
        })
        .eq("id", pageId);

      if (error) throw error;
      alert("✅ Page berhasil disimpan!");
    } catch (err: any) {
      console.error("❌ Error saving:", err);
      alert(`Gagal save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500 to-rose-600 text-white">
        <div>
          <h2 className="font-bold text-lg">{pageName}</h2>
          <p className="text-xs opacity-80">Landing Page Builder</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Mode */}
          <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-2 rounded ${
                previewMode === "desktop"
                  ? "bg-white text-red-600"
                  : "hover:bg-white/20"
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("tablet")}
              className={`p-2 rounded ${
                previewMode === "tablet"
                  ? "bg-white text-red-600"
                  : "hover:bg-white/20"
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-2 rounded ${
                previewMode === "mobile"
                  ? "bg-white text-red-600"
                  : "hover:bg-white/20"
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={savePage}
            disabled={saving}
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => router.push("/web-builder")}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Elements */}
        <div className="w-64 bg-gray-900 p-4 overflow-y-auto">
          <h3 className="text-white font-semibold mb-4">Add Elements</h3>
          <div className="space-y-2">
            <button
              onClick={() => addElement("heading")}
              className="w-full flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-left text-white"
            >
              <Type className="w-5 h-5 text-red-500" />
              <span className="text-sm">Heading</span>
            </button>

            <button
              onClick={() => addElement("text")}
              className="w-full flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-left text-white"
            >
              <AlignLeft className="w-5 h-5 text-red-500" />
              <span className="text-sm">Text</span>
            </button>

            <button
              onClick={() => addElement("button")}
              className="w-full flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-left text-white"
            >
              <MousePointer className="w-5 h-5 text-red-500" />
              <span className="text-sm">Button</span>
            </button>

            <button
              onClick={() => addElement("image")}
              className="w-full flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-left text-white"
            >
              <ImageIcon className="w-5 h-5 text-red-500" />
              <span className="text-sm">Image</span>
            </button>

            <button
              onClick={() => addElement("spacer")}
              className="w-full flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-left text-white"
            >
              <Square className="w-5 h-5 text-red-500" />
              <span className="text-sm">Spacer</span>
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-800 overflow-auto p-8">
          <div
            className="mx-auto bg-white rounded-lg overflow-hidden transition-all duration-300 min-h-[600px]"
            style={{ width: getPreviewWidth() }}
          >
            <div className="p-8">
              {elements.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p>Canvas kosong</p>
                  <p className="text-sm mt-2">
                    Tambah element dari sidebar kiri
                  </p>
                </div>
              ) : (
                elements.map((element, index) => (
                  <div
                    key={element.id}
                    onClick={() => setSelectedId(element.id)}
                    className={`relative group cursor-pointer transition-all ${
                      selectedId === element.id
                        ? "ring-2 ring-red-500"
                        : "hover:ring-2 hover:ring-red-300"
                    }`}
                    style={element.styles as CSSProperties}
                  >
                    {element.type === "image" ? (
                      <img src={element.content} alt="Element" className="w-full" />
                    ) : element.type === "spacer" ? (
                      selectedId === element.id && (
                        <div className="text-center text-gray-400 text-xs">
                          Spacer
                        </div>
                      )
                    ) : (
                      element.content
                    )}

                    {selectedId === element.id && (
                      <div className="absolute -top-10 left-0 bg-gray-800 text-white rounded-lg px-2 py-1 flex items-center gap-1 text-xs z-10 shadow-lg">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveElement(element.id, "up");
                          }}
                          className="hover:bg-gray-700 p-1 rounded"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveElement(element.id, "down");
                          }}
                          className="hover:bg-gray-700 p-1 rounded"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateElement(element.id);
                          }}
                          className="hover:bg-gray-700 p-1 rounded"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(element.id);
                          }}
                          className="hover:bg-red-600 p-1 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-gray-900 p-4 overflow-y-auto">
          <h3 className="text-white font-semibold mb-4">Properties</h3>

          {!selectedElement ? (
            <p className="text-gray-400 text-sm">Pilih element untuk edit</p>
          ) : (
            <div className="space-y-4">
              {/* Content */}
              {selectedElement.type !== "spacer" && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Content
                  </label>
                  {selectedElement.type === "image" ? (
                    <input
                      type="text"
                      value={selectedElement.content}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          content: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-800 text-white"
                      placeholder="Image URL"
                    />
                  ) : (
                    <textarea
                      value={selectedElement.content}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          content: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-800 text-white"
                      rows={3}
                    />
                  )}
                </div>
              )}

              {/* Styles */}
              <div className="space-y-3 pt-3 border-t border-gray-700">
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  Styling
                </p>

                {selectedElement.type !== "spacer" && selectedElement.type !== "image" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">
                        Font Size
                      </label>
                      <input
                        type="text"
                        value={selectedElement.styles.fontSize || "16px"}
                        onChange={(e) =>
                          updateStyle(selectedElement.id, "fontSize", e.target.value)
                        }
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-800 text-white"
                        placeholder="16px"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-white">
                        Color
                      </label>
                      <input
                        type="color"
                        value={selectedElement.styles.color || "#000000"}
                        onChange={(e) =>
                          updateStyle(selectedElement.id, "color", e.target.value)
                        }
                        className="w-full h-10 rounded border bg-gray-800"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Background
                  </label>
                  <input
                    type="color"
                    value={selectedElement.styles.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      updateStyle(selectedElement.id, "backgroundColor", e.target.value)
                    }
                    className="w-full h-10 rounded border bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Padding
                  </label>
                  <input
                    type="text"
                    value={selectedElement.styles.padding || ""}
                    onChange={(e) =>
                      updateStyle(selectedElement.id, "padding", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-800 text-white"
                    placeholder="20px"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Margin
                  </label>
                  <input
                    type="text"
                    value={selectedElement.styles.margin || ""}
                    onChange={(e) =>
                      updateStyle(selectedElement.id, "margin", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-800 text-white"
                    placeholder="20px 0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-white">
                    Border Radius
                  </label>
                  <input
                    type="text"
                    value={selectedElement.styles.borderRadius || ""}
                    onChange={(e) =>
                      updateStyle(selectedElement.id, "borderRadius", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-800 text-white"
                    placeholder="8px"
                  />
                </div>

                {selectedElement.type === "spacer" && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white">
                      Height
                    </label>
                    <input
                      type="text"
                      value={selectedElement.styles.height || "40px"}
                      onChange={(e) =>
                        updateStyle(selectedElement.id, "height", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-800 text-white"
                      placeholder="40px"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}