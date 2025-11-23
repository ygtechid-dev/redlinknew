'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { builderStore } from '@/lib/builder/store';
import { supabase } from '@/lib/supabase';
import BuilderSidebar from '@/components/builder/Sidebar';
import BuilderCanvas from '@/components/builder/Canvas';
import PropertiesPanel from '@/components/builder/PropertiesPanel';
import BuilderToolbar from '@/components/builder/Toolbar';

export default function BuilderPage() {
  const [, forceUpdate] = useState({});
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = builderStore.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Load existing page if pageId provided
    const id = searchParams.get('pageId');
    if (id) {
      setPageId(id);
      loadPage(id);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const loadPage = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('builder_pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data && data.page_data) {
        builderStore.loadPage({
          name: data.page_name,
          slug: data.page_slug,
          elements: data.page_data.elements || []
        });
      }
    } catch (err) {
      console.error('❌ Error loading page:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!pageId) {
      // If no pageId, just export to console
      const page = builderStore.exportPage();
      console.log('Page data:', page);
      alert('Page data logged to console!');
      return;
    }

    try {
      const pageData = builderStore.exportPage();
      
      // Update database
      const { error } = await supabase
        .from('builder_pages')
        .update({
          page_data: { elements: pageData.elements },
          updated_at: new Date().toISOString(),
        })
        .eq('id', pageId);

      if (error) throw error;

      // Send message to parent window
      window.parent.postMessage({
        type: 'BUILDER_SAVE',
        payload: { elements: pageData.elements }
      }, '*');

      alert('✅ Page saved successfully!');
    } catch (err: any) {
      console.error('❌ Error saving:', err);
      alert(`Failed to save: ${err.message}`);
    }
  };

  const handleClose = () => {
    // Send close message to parent
    window.parent.postMessage({
      type: 'BUILDER_CLOSE'
    }, '*');
  };

  // Listen for save success/error from parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SAVE_SUCCESS') {
        alert(event.data.message);
      } else if (event.data.type === 'SAVE_ERROR') {
        alert(event.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Toolbar */}
      <BuilderToolbar 
        onSave={handleSave} 
        onClose={pageId ? handleClose : undefined}
      />

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Component List */}
        <BuilderSidebar />

        {/* Canvas - Drag & Drop Area */}
        <BuilderCanvas />

        {/* Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
}