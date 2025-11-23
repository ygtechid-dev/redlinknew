'use client';

import { builderStore } from '@/lib/builder/store';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function PropertiesPanel() {
  const selectedElement = builderStore.getSelectedElement();
  const [openSections, setOpenSections] = useState({
    content: true,
    layout: true,
    typography: true,
    colors: true,
    border: false,
    effects: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!selectedElement) {
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-800 p-4">
        <div className="text-gray-500 text-center py-8">
          <Settings size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select an element to edit</p>
        </div>
      </div>
    );
  }

  const updateContent = (field: string, value: string) => {
    builderStore.updateElement(selectedElement.id, {
      content: { ...selectedElement.content, [field]: value }
    });
  };

  const updateStyle = (field: string, value: string) => {
    builderStore.updateElement(selectedElement.id, {
      style: { ...selectedElement.style, [field]: value }
    });
  };

  const Section = ({ 
    title, 
    name, 
    children 
  }: { 
    title: string; 
    name: keyof typeof openSections; 
    children: React.ReactNode 
  }) => (
    <div className="border-b border-gray-800">
      <button
        onClick={() => toggleSection(name)}
        className="w-full flex items-center justify-between py-3 px-2 hover:bg-gray-800/50 transition"
      >
        <span className="text-white font-medium text-sm">{title}</span>
        {openSections[name] ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      {openSections[name] && (
        <div className="pb-4 px-2 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    type = 'text' 
  }: { 
    label: string; 
    value: string; 
    onChange: (v: string) => void; 
    placeholder?: string;
    type?: string;
  }) => (
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
      />
    </div>
  );

  const SelectField = ({ 
    label, 
    value, 
    onChange, 
    options 
  }: { 
    label: string; 
    value: string; 
    onChange: (v: string) => void; 
    options: { value: string; label: string }[];
  }) => (
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  const ColorField = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: string; 
    onChange: (v: string) => void; 
  }) => (
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="transparent"
          className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
        />
      </div>
    </div>
  );

  const hasTextContent = ['heading', 'text', 'button'].includes(selectedElement.type);
  const hasImageContent = selectedElement.type === 'image';

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Settings size={18} />
          Properties
        </h2>
        <div className="mt-2 px-3 py-2 bg-gray-800 rounded text-white text-sm">
          {selectedElement.type}
        </div>
      </div>

      <div>
        {/* CONTENT SECTION */}
        <Section title="Content" name="content">
          {selectedElement.type === 'heading' && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">
                Heading Text
              </label>
              <input
                type="text"
                value={selectedElement.content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {selectedElement.type === 'text' && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">
                Text Content
              </label>
              <textarea
                value={selectedElement.content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {selectedElement.type === 'button' && (
            <>
              <InputField
                label="Button Text"
                value={selectedElement.content.text || ''}
                onChange={(v) => updateContent('text', v)}
              />
              <InputField
                label="Link URL"
                value={selectedElement.content.href || ''}
                onChange={(v) => updateContent('href', v)}
                placeholder="https://..."
              />
            </>
          )}

          {hasImageContent && (
            <>
              <InputField
                label="Image URL"
                value={selectedElement.content.src || ''}
                onChange={(v) => updateContent('src', v)}
                placeholder="https://..."
              />
              <InputField
                label="Alt Text"
                value={selectedElement.content.alt || ''}
                onChange={(v) => updateContent('alt', v)}
              />
            </>
          )}
        </Section>

        {/* LAYOUT SECTION */}
        <Section title="Layout" name="layout">
          <div className="grid grid-cols-2 gap-2">
            <InputField
              label="Width"
              value={selectedElement.style?.width || ''}
              onChange={(v) => updateStyle('width', v)}
              placeholder="auto"
            />
            <InputField
              label="Height"
              value={selectedElement.style?.height || ''}
              onChange={(v) => updateStyle('height', v)}
              placeholder="auto"
            />
          </div>

          <InputField
            label="Padding"
            value={selectedElement.style?.padding || ''}
            onChange={(v) => updateStyle('padding', v)}
            placeholder="10px 20px"
          />

          <InputField
            label="Margin"
            value={selectedElement.style?.margin || ''}
            onChange={(v) => updateStyle('margin', v)}
            placeholder="10px 0"
          />

          {(selectedElement.type === 'container' || selectedElement.type === 'columns') && (
            <>
              <SelectField
                label="Display"
                value={selectedElement.style?.display || 'block'}
                onChange={(v) => updateStyle('display', v)}
                options={[
                  { value: 'block', label: 'Block' },
                  { value: 'flex', label: 'Flex' },
                  { value: 'inline-block', label: 'Inline Block' },
                  { value: 'grid', label: 'Grid' }
                ]}
              />

              {selectedElement.style?.display === 'flex' && (
                <>
                  <SelectField
                    label="Flex Direction"
                    value={selectedElement.style?.flexDirection || 'row'}
                    onChange={(v) => updateStyle('flexDirection', v)}
                    options={[
                      { value: 'row', label: 'Row' },
                      { value: 'column', label: 'Column' }
                    ]}
                  />
                  <SelectField
                    label="Justify Content"
                    value={selectedElement.style?.justifyContent || 'flex-start'}
                    onChange={(v) => updateStyle('justifyContent', v)}
                    options={[
                      { value: 'flex-start', label: 'Start' },
                      { value: 'center', label: 'Center' },
                      { value: 'flex-end', label: 'End' },
                      { value: 'space-between', label: 'Space Between' },
                      { value: 'space-around', label: 'Space Around' }
                    ]}
                  />
                  <SelectField
                    label="Align Items"
                    value={selectedElement.style?.alignItems || 'stretch'}
                    onChange={(v) => updateStyle('alignItems', v)}
                    options={[
                      { value: 'stretch', label: 'Stretch' },
                      { value: 'flex-start', label: 'Start' },
                      { value: 'center', label: 'Center' },
                      { value: 'flex-end', label: 'End' }
                    ]}
                  />
                  <InputField
                    label="Gap"
                    value={selectedElement.style?.gap || ''}
                    onChange={(v) => updateStyle('gap', v)}
                    placeholder="10px"
                  />
                </>
              )}
            </>
          )}
        </Section>

        {/* TYPOGRAPHY SECTION */}
        {hasTextContent && (
          <Section title="Typography" name="typography">
            <InputField
              label="Font Size"
              value={selectedElement.style?.fontSize || ''}
              onChange={(v) => updateStyle('fontSize', v)}
              placeholder="16px"
            />

            <SelectField
              label="Font Weight"
              value={selectedElement.style?.fontWeight || '400'}
              onChange={(v) => updateStyle('fontWeight', v)}
              options={[
                { value: '300', label: 'Light' },
                { value: '400', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: '700', label: 'Bold' },
                { value: '800', label: 'Extra Bold' }
              ]}
            />

            <SelectField
              label="Text Align"
              value={selectedElement.style?.textAlign || 'left'}
              onChange={(v) => updateStyle('textAlign', v)}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
                { value: 'justify', label: 'Justify' }
              ]}
            />
          </Section>
        )}

        {/* COLORS SECTION */}
        <Section title="Colors" name="colors">
          <ColorField
            label="Background Color"
            value={selectedElement.style?.backgroundColor || ''}
            onChange={(v) => updateStyle('backgroundColor', v)}
          />

          {hasTextContent && (
            <ColorField
              label="Text Color"
              value={selectedElement.style?.color || ''}
              onChange={(v) => updateStyle('color', v)}
            />
          )}
        </Section>

        {/* BORDER SECTION */}
        <Section title="Border" name="border">
          <InputField
            label="Border"
            value={selectedElement.style?.border || ''}
            onChange={(v) => updateStyle('border', v)}
            placeholder="1px solid #000"
          />

          <InputField
            label="Border Radius"
            value={selectedElement.style?.borderRadius || ''}
            onChange={(v) => updateStyle('borderRadius', v)}
            placeholder="8px"
          />
        </Section>

        {/* EFFECTS SECTION */}
        <Section title="Effects" name="effects">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">
              Box Shadow
            </label>
            <input
              type="text"
              value={selectedElement.style?.boxShadow || ''}
              onChange={(e) => updateStyle('boxShadow', e.target.value)}
              placeholder="0 4px 6px rgba(0,0,0,0.1)"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
            />
            <div className="mt-2 text-xs text-gray-500">
              Examples:
              <div className="mt-1 space-y-1">
                <button
                  onClick={() => updateStyle('boxShadow', '0 1px 3px rgba(0,0,0,0.12)')}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-800 rounded text-gray-400"
                >
                  Small
                </button>
                <button
                  onClick={() => updateStyle('boxShadow', '0 4px 6px rgba(0,0,0,0.1)')}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-800 rounded text-gray-400"
                >
                  Medium
                </button>
                <button
                  onClick={() => updateStyle('boxShadow', '0 10px 20px rgba(0,0,0,0.15)')}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-800 rounded text-gray-400"
                >
                  Large
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">
              Opacity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedElement.style?.opacity || '1'}
              onChange={(e) => updateStyle('opacity', e.target.value)}
              className="w-full"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {(parseFloat(selectedElement.style?.opacity || '1') * 100).toFixed(0)}%
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}