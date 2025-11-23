'use client';

import { builderStore } from '@/lib/builder/store';
import { Undo2, Redo2, Save, Eye, Trash2, Download, X } from 'lucide-react';

interface BuilderToolbarProps {
  onSave?: () => void;
  onClose?: () => void;
}

export default function BuilderToolbar({ onSave, onClose }: BuilderToolbarProps) {
  const handleUndo = () => builderStore.undo();
  const handleRedo = () => builderStore.redo();
  const handleClear = () => {
    if (confirm('Clear all elements?')) {
      builderStore.clear();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      const page = builderStore.exportPage();
      console.log('Page data:', page);
      alert('Page data logged to console!');
    }
  };

  const handlePreview = () => {
    const page = builderStore.exportPage();
    // Buka di tab baru atau modal
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(generatePreviewHTML(page.elements));
    }
  };

  const handleExport = () => {
    const page = builderStore.exportPage();
    const blob = new Blob([JSON.stringify(page, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page.json';
    a.click();
  };

  return (
    <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-white font-semibold text-lg">Page Builder</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleUndo}
          className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition"
          title="Undo"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={handleRedo}
          className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition"
          title="Redo"
        >
          <Redo2 size={18} />
        </button>
        
        <div className="w-px h-6 bg-gray-800 mx-2" />

        <button
          onClick={handleClear}
          className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition"
          title="Clear All"
        >
          <Trash2 size={18} />
        </button>

        <button
          onClick={handleExport}
          className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition"
          title="Export JSON"
        >
          <Download size={18} />
        </button>

        <button
          onClick={handlePreview}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 transition"
        >
          <Eye size={18} />
          Preview
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2 transition"
        >
          <Save size={18} />
          Save
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition"
            title="Close"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function generatePreviewHTML(elements: any[]): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preview</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; }
      </style>
    </head>
    <body>
      ${elements.map(el => renderElement(el)).join('')}
    </body>
    </html>
  `;
}

function renderElement(el: any): string {
  const style = Object.entries(el.style || {})
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
    .join('; ');

  switch (el.type) {
    case 'heading':
      return `<h2 style="${style}">${el.content.text || 'Heading'}</h2>`;
    case 'text':
      return `<p style="${style}">${el.content.text || 'Text'}</p>`;
    case 'button':
      return `<button style="${style}">${el.content.text || 'Button'}</button>`;
    case 'image':
      return `<img src="${el.content.src || ''}" alt="${el.content.alt || ''}" style="${style}" />`;
    case 'container':
      const children = (el.children || []).map(renderElement).join('');
      return `<div style="${style}">${children}</div>`;
    default:
      return `<div style="${style}"></div>`;
  }
}