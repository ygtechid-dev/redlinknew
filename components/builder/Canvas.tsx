'use client';

import { builderStore } from '@/lib/builder/store';
import { BuilderElement, ElementType } from '@/lib/builder/types';
import RenderElement from './RenderElement';

export default function BuilderCanvas() {
  const elements = builderStore.getElements();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const elementType = e.dataTransfer.getData('elementType') as ElementType;
    if (elementType) {
      const newElement = createDefaultElement(elementType);
      builderStore.addElement(newElement);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect when clicking canvas background
    if (e.target === e.currentTarget) {
      builderStore.selectElement(null);
    }
  };

  return (
    <div 
      className="flex-1 bg-gray-900 overflow-auto p-8"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
    >
      <div className="max-w-6xl mx-auto bg-white min-h-screen shadow-2xl">
        {elements.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Empty Canvas</p>
              <p className="text-sm">Drag components from the left sidebar</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {elements.map((element) => (
              <RenderElement key={element.id} element={element} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function createDefaultElement(type: ElementType): BuilderElement {
  const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const defaults: Record<ElementType, BuilderElement> = {
    container: {
      id,
      type: 'container',
      content: {},
      style: {
        padding: '20px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        margin: '10px 0'
      },
      children: []
    },
    heading: {
      id,
      type: 'heading',
      content: { text: 'Heading Text' },
      style: {
        fontSize: '32px',
        fontWeight: '700',
        margin: '10px 0',
        color: '#111827'
      }
    },
    text: {
      id,
      type: 'text',
      content: { text: 'This is a paragraph text. Click to edit.' },
      style: {
        fontSize: '16px',
        margin: '10px 0',
        color: '#374151'
      }
    },
    button: {
      id,
      type: 'button',
      content: { text: 'Click Me' },
      style: {
        padding: '12px 24px',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        border: 'none',
        margin: '10px 0',
        display: 'inline-block'
      }
    },
    image: {
      id,
      type: 'image',
      content: { 
        src: 'https://via.placeholder.com/800x400',
        alt: 'Placeholder image'
      },
      style: {
        width: '100%',
        height: 'auto',
        margin: '10px 0',
        borderRadius: '8px'
      }
    },
    spacer: {
      id,
      type: 'spacer',
      content: {},
      style: {
        height: '40px'
      }
    },
    divider: {
      id,
      type: 'divider',
      content: {},
      style: {
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '20px 0'
      }
    },
    columns: {
      id,
      type: 'columns',
      content: {},
      style: {
        display: 'flex',
        gap: '20px',
        margin: '10px 0'
      },
      children: [
        {
          id: `${id}_col1`,
          type: 'container',
          content: {},
          style: {
            flex: '1',
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          },
          children: []
        },
        {
          id: `${id}_col2`,
          type: 'container',
          content: {},
          style: {
            flex: '1',
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          },
          children: []
        }
      ]
    }
  };

  return defaults[type];
}