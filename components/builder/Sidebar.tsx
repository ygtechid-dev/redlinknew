'use client';

import { ElementType } from '@/lib/builder/types';
import { 
  Box, 
  Type, 
  AlignLeft, 
  MousePointer, 
  Image, 
  Minus,
  Columns,
  Space
} from 'lucide-react';

interface ComponentItem {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
}

const components: ComponentItem[] = [
  { type: 'container', label: 'Container', icon: <Box size={20} /> },
  { type: 'columns', label: 'Columns', icon: <Columns size={20} /> },
  { type: 'heading', label: 'Heading', icon: <Type size={20} /> },
  { type: 'text', label: 'Text', icon: <AlignLeft size={20} /> },
  { type: 'button', label: 'Button', icon: <MousePointer size={20} /> },
  { type: 'image', label: 'Image', icon: <Image size={20} /> },
  { type: 'spacer', label: 'Spacer', icon: <Space size={20} /> },
  { type: 'divider', label: 'Divider', icon: <Minus size={20} /> },
];

export default function BuilderSidebar() {
  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData('elementType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-white font-semibold mb-4">Components</h2>
        
        <div className="space-y-2">
          {components.map((comp) => (
            <div
              key={comp.type}
              draggable
              onDragStart={(e) => handleDragStart(e, comp.type)}
              className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-750 rounded cursor-move transition group"
            >
              <div className="text-gray-400 group-hover:text-blue-400 transition">
                {comp.icon}
              </div>
              <span className="text-gray-300 text-sm font-medium">
                {comp.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-gray-800/50 rounded text-xs text-gray-500">
          💡 Drag components to canvas
        </div>
      </div>
    </div>
  );
}