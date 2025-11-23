'use client';

import { BuilderElement } from '@/lib/builder/types';

interface PreviewRendererProps {
  page: {
    page_name: string;
    page_data: {
      elements: BuilderElement[];
    };
  };
}

export default function PreviewRenderer({ page }: PreviewRendererProps) {
  const elements = page.page_data?.elements || [];

  return (
    <div className="min-h-screen bg-white">
      <title>{page.page_name}</title>
      {elements.map((element) => (
        <RenderElement key={element.id} element={element} />
      ))}
    </div>
  );
}

function RenderElement({ element }: { element: BuilderElement }) {
  const style = element.style || {};

  switch (element.type) {
    case 'container':
      return (
        <div style={style}>
          {element.children?.map((child) => (
            <RenderElement key={child.id} element={child} />
          ))}
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
      if (element.content.href) {
        return (
          <a
            href={element.content.href}
            style={{ 
              ...style, 
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            {element.content.text || 'Button'}
          </a>
        );
      }
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
      return null;
  }
}