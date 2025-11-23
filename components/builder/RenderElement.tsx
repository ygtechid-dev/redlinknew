'use client';

import { builderStore } from '@/lib/builder/store';
import { BuilderElement, ElementType } from '@/lib/builder/types';
import { Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface Props {
  element: BuilderElement;
}

export default function RenderElement({ element }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const selectedId = builderStore.getSelectedId();
  const isSelected = selectedId === element.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    builderStore.selectElement(element.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    builderStore.deleteElement(element.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const elementType = e.dataTransfer.getData('elementType') as ElementType;
    if (elementType && (element.type === 'container' || element.type === 'columns')) {
      const newElement = createDefaultElement(elementType);
      builderStore.addElement(newElement, element.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (element.type === 'container' || element.type === 'columns') {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const wrapperClass = `
    relative group
    ${isSelected ? 'ring-2 ring-blue-500' : ''}
    ${isHovered && !isSelected ? 'ring-2 ring-blue-300' : ''}
  `;

  return (
    <div
      className={wrapperClass}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Controls */}
      {(isHovered || isSelected) && (
        <div className="absolute -top-8 left-0 bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-2 z-10">
          <GripVertical size={12} />
          <span className="font-medium">{element.type}</span>
          <button
            onClick={handleDelete}
            className="ml-2 hover:bg-blue-700 p-1 rounded"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Element Content */}
      {renderContent(element)}
    </div>
  );
}

function renderContent(element: BuilderElement) {
  const style = element.style || {};

  switch (element.type) {
    case 'container':
      return (
        <div style={style}>
          {element.children && element.children.length > 0 ? (
            element.children.map((child) => (
              <RenderElement key={child.id} element={child} />
            ))
          ) : (
            <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 rounded">
              Drop components here
            </div>
          )}
        </div>
      );

    case 'columns':
      return (
        <div style={style}>
          {element.children?.map((child) => (
            <RenderElement key={child.id} element={child} />
          ))}
        </div>
      );

    case 'heading':
      return (
        <h2 style={style}>
          {element.content.text || 'Heading'}
        </h2>
      );

    case 'text':
      return (
        <p style={style}>
          {element.content.text || 'Text'}
        </p>
      );

    case 'button':
      return (
        <button style={style}>
          {element.content.text || 'Button'}
        </button>
      );

    case 'image':
      return (
        <img
          src={element.content.src || 'https://via.placeholder.com/800x400'}
          alt={element.content.alt || 'Image'}
          style={style}
        />
      );

    case 'spacer':
      return <div style={style} />;

    case 'divider':
      return <div style={style} />;

    default:
      return <div style={style}>Unknown element</div>;
  }
}

function createDefaultElement(type: ElementType): BuilderElement {
  const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const defaults: Record<ElementType, Partial<BuilderElement>> = {
    heading: {
      type: 'heading',
      content: { text: 'Heading' },
      style: { fontSize: '24px', fontWeight: '700', margin: '10px 0' }
    },
    text: {
      type: 'text',
      content: { text: 'Text paragraph' },
      style: { fontSize: '16px', margin: '10px 0' }
    },
    button: {
      type: 'button',
      content: { text: 'Button' },
      style: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: '#fff',
        borderRadius: '6px'
      }
    },
    image: {
      type: 'image',
      content: { src: 'https://via.placeholder.com/400x300' },
      style: { width: '100%', borderRadius: '8px', margin: '10px 0' }
    },
    spacer: {
      type: 'spacer',
      content: {},
      style: { height: '30px' }
    },
    divider: {
      type: 'divider',
      content: {},
      style: { height: '1px', backgroundColor: '#e5e7eb', margin: '15px 0' }
    },
    container: {
      type: 'container',
      content: {},
      style: { padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' },
      children: []
    },
    columns: {
      type: 'columns',
      content: {},
      style: { display: 'flex', gap: '15px' },
      children: []
    }
  };

  return { id, ...defaults[type] } as BuilderElement;
}