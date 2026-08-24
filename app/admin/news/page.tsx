'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { AdminTablePageSkeleton } from '@/app/components/skeletons/PageSkeletons';
import DataTable from '@/app/components/admin/DataTable';
import { logger } from '@/app/lib/logger';
import type { NewsContentBlock, NewsRecord } from '@/app/lib/db/newsRepository';

type ImageSourceMode = 'upload' | 'url';
type BlockDraft = NewsContentBlock & { localKey: string };

function createLocalKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toDatetimeLocalValue(value?: string | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

async function uploadNewsImage(file: File): Promise<string> {
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  const uploadResponse = await fetch('/api/upload-news-image', {
    method: 'POST',
    body: uploadFormData,
  });
  if (!uploadResponse.ok) {
    const uploadError = await uploadResponse.json().catch(() => ({}));
    throw new Error(uploadError.error || 'Failed to upload image');
  }
  const uploadResult = await uploadResponse.json();
  return uploadResult.url as string;
}

function AutoTextarea({
  value,
  onChange,
  placeholder,
  required,
  minRows = 1,
  maxRows = 12,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minRows?: number;
  maxRows?: number;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight) || 20;
    const maxHeight = lineHeight * maxRows + 16;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, lineHeight * minRows + 16), maxHeight)}px`;
  }, [value, minRows, maxRows]);

  return (
    <textarea
      ref={ref}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className={`w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none overflow-hidden ${className}`}
    />
  );
}

function ImageSourceFields({
  mode,
  onModeChange,
  urlValue,
  onUrlChange,
  fileInputRef,
  onFileChange,
  previewUrl,
  compact = false,
}: {
  mode: ImageSourceMode;
  onModeChange: (mode: ImageSourceMode) => void;
  urlValue: string;
  onUrlChange: (value: string) => void;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  compact?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => onModeChange('upload')}
            className={`px-2.5 py-1 text-xs font-medium ${
              mode === 'upload' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => onModeChange('url')}
            className={`px-2.5 py-1 text-xs font-medium border-l border-gray-200 ${
              mode === 'url' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            URL
          </button>
        </div>
        {mode === 'upload' ? (
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={onFileChange}
            className="flex-1 min-w-[180px] text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
          />
        ) : (
          <input
            type="url"
            value={urlValue}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 min-w-[180px] px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        )}
      </div>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className={`${compact ? 'h-16 w-28' : 'h-24 w-40'} object-cover rounded border border-gray-200`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
    </div>
  );
}

export default function NewsManagement() {
  const [newsItems, setNewsItems] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNews, setEditingNews] = useState<NewsRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [publishedAt, setPublishedAt] = useState(toDatetimeLocalValue());
  const [status, setStatus] = useState(true);
  const [blocks, setBlocks] = useState<BlockDraft[]>([]);

  const [coverMode, setCoverMode] = useState<ImageSourceMode>('upload');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);

  const [blockImageFiles, setBlockImageFiles] = useState<Record<string, File | null>>({});
  const [blockImageModes, setBlockImageModes] = useState<Record<string, ImageSourceMode>>({});

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      setLoading(true);
      const response = await fetch('/api/news?includeInactive=true');
      if (!response.ok) throw new Error('Failed to fetch news');
      const result = await response.json();
      setNewsItems(result.data || []);
      setError(null);
    } catch (err) {
      logger.error('Error loading news:', err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const resetForm = (keepOpen = false) => {
    setEditingNews(null);
    setTitle('');
    setSummary('');
    setPublishedAt(toDatetimeLocalValue());
    setStatus(true);
    setBlocks([]);
    setCoverMode('upload');
    setCoverUrl('');
    setCoverFile(null);
    setCoverPreview(null);
    setCoverOpen(false);
    setExpandedBlocks({});
    setBlockImageFiles({});
    setBlockImageModes({});
    if (coverFileRef.current) coverFileRef.current.value = '';
    setShowForm(keepOpen);
  };

  const openCreateForm = () => {
    resetForm(true);
    setShowForm(true);
  };

  const handleEdit = (item: NewsRecord) => {
    setEditingNews(item);
    setTitle(item.title);
    setSummary(item.summary);
    setPublishedAt(toDatetimeLocalValue(item.published_at));
    setStatus(item.status);
    setCoverMode(item.cover_image_url ? 'url' : 'upload');
    setCoverUrl(item.cover_image_url || '');
    setCoverPreview(item.cover_image_url);
    setCoverFile(null);
    setCoverOpen(Boolean(item.cover_image_url));

    const drafted = (item.content_blocks || []).map((block) => ({
      ...block,
      localKey: createLocalKey(),
    }));
    setBlocks(drafted);

    const modes: Record<string, ImageSourceMode> = {};
    const expanded: Record<string, boolean> = {};
    drafted.forEach((block, index) => {
      expanded[block.localKey] = index === drafted.length - 1;
      if (block.type === 'image') modes[block.localKey] = 'url';
    });
    setExpandedBlocks(expanded);
    setBlockImageModes(modes);
    setBlockImageFiles({});
    setShowForm(true);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addBlock = (type: NewsContentBlock['type']) => {
    const localKey = createLocalKey();
    if (type === 'heading') {
      setBlocks((prev) => [...prev, { type: 'heading', text: '', localKey }]);
    } else if (type === 'paragraph') {
      setBlocks((prev) => [...prev, { type: 'paragraph', text: '', localKey }]);
    } else {
      setBlocks((prev) => [...prev, { type: 'image', url: '', caption: '', localKey }]);
      setBlockImageModes((prev) => ({ ...prev, [localKey]: 'upload' }));
    }
    setExpandedBlocks((prev) => ({ ...prev, [localKey]: true }));
  };

  const updateBlock = (localKey: string, patch: Partial<NewsContentBlock>) => {
    setBlocks((prev) =>
      prev.map((block) => (block.localKey === localKey ? ({ ...block, ...patch } as BlockDraft) : block))
    );
  };

  const removeBlock = (localKey: string) => {
    setBlocks((prev) => prev.filter((block) => block.localKey !== localKey));
    setBlockImageFiles((prev) => {
      const next = { ...prev };
      delete next[localKey];
      return next;
    });
    setBlockImageModes((prev) => {
      const next = { ...prev };
      delete next[localKey];
      return next;
    });
    setExpandedBlocks((prev) => {
      const next = { ...prev };
      delete next[localKey];
      return next;
    });
  };

  const moveBlock = (localKey: string, direction: -1 | 1) => {
    setBlocks((prev) => {
      const index = prev.findIndex((block) => block.localKey === localKey);
      if (index < 0) return prev;
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

  const toggleBlock = (localKey: string) => {
    setExpandedBlocks((prev) => ({ ...prev, [localKey]: !prev[localKey] }));
  };

  const blockPreviewLabel = (block: BlockDraft) => {
    if (block.type === 'heading' || block.type === 'paragraph') {
      return block.text.trim() || `(empty ${block.type})`;
    }
    return block.caption?.trim() || block.url.trim() || '(empty image)';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      if (!title.trim() || !summary.trim()) {
        throw new Error('Title and summary are required');
      }

      let resolvedCoverUrl = coverUrl.trim();
      if (coverMode === 'upload' && coverFile) {
        resolvedCoverUrl = await uploadNewsImage(coverFile);
      } else if (coverMode === 'upload' && !coverFile && editingNews?.cover_image_url) {
        resolvedCoverUrl = editingNews.cover_image_url;
      }

      const resolvedBlocks: NewsContentBlock[] = [];
      for (const block of blocks) {
        if (block.type === 'heading') {
          if (!block.text.trim()) continue;
          resolvedBlocks.push({ type: 'heading', text: block.text.trim() });
          continue;
        }
        if (block.type === 'paragraph') {
          if (!block.text.trim()) continue;
          resolvedBlocks.push({ type: 'paragraph', text: block.text.trim() });
          continue;
        }

        const mode = blockImageModes[block.localKey] || 'url';
        let imageUrl = block.url.trim();
        const pendingFile = blockImageFiles[block.localKey];
        if (mode === 'upload' && pendingFile) {
          imageUrl = await uploadNewsImage(pendingFile);
        }
        if (!imageUrl || imageUrl.startsWith('data:')) {
          throw new Error('Each image section needs an uploaded file or a public image URL');
        }
        resolvedBlocks.push({
          type: 'image',
          url: imageUrl,
          caption: block.caption?.trim() || undefined,
        });
      }

      if (resolvedBlocks.length === 0) {
        throw new Error('Add at least one article section (heading, paragraph, or image)');
      }

      const payload = {
        title: title.trim(),
        summary: summary.trim(),
        cover_image_url: resolvedCoverUrl || null,
        content_blocks: resolvedBlocks,
        status,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      };

      const response = await fetch('/api/news', {
        method: editingNews ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNews ? { ...payload, id: editingNews.id } : payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Failed to save news');
      }

      await loadNews();
      resetForm(false);
    } catch (err) {
      logger.error('Error saving news:', err);
      setError(err instanceof Error ? err.message : 'Failed to save news. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news post?')) return;
    try {
      const response = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete news');
      await loadNews();
    } catch (err) {
      logger.error('Error deleting news:', err);
      setError('Failed to delete news. Please try again later.');
    }
  };

  if (loading) return <AdminTablePageSkeleton />;

  const activeCount = newsItems.filter((item) => item.status).length;
  const inactiveCount = newsItems.length - activeCount;

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Manage News</h1>
          <p className="text-sm text-gray-600">Publish structured company updates</p>
        </div>
        <button
          onClick={showForm && !editingNews ? () => resetForm(false) : openCreateForm}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm"
        >
          {showForm && !editingNews ? 'Close Form' : 'Add News Post'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-semibold text-gray-900 leading-tight">{newsItems.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500">Published</p>
          <p className="text-lg font-semibold text-green-700 leading-tight">{activeCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500">Inactive</p>
          <p className="text-lg font-semibold text-gray-700 leading-tight">{inactiveCount}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm" role="alert">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.div
            key="news-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">
                  {editingNews ? 'Edit News Post' : 'Create News Post'}
                </h2>
                <button
                  type="button"
                  onClick={() => resetForm(false)}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  <div className="lg:col-span-8 space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Announcement title"
                    />
                  </div>
                  <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Published date</label>
                      <input
                        type="datetime-local"
                        value={publishedAt}
                        onChange={(e) => setPublishedAt(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <label className="inline-flex items-center gap-2 text-xs text-gray-700 mt-auto pb-1">
                      <input
                        type="checkbox"
                        checked={status}
                        onChange={(e) => setStatus(e.target.checked)}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      Published
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Short summary *</label>
                  <AutoTextarea
                    required
                    value={summary}
                    onChange={setSummary}
                    minRows={2}
                    maxRows={6}
                    placeholder="One or two sentences for the listing card"
                  />
                </div>

                <div className="border border-gray-200 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setCoverOpen((open) => !open)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hover:bg-gray-50 rounded-lg"
                  >
                    <span>
                      Cover image {coverPreview ? '(set)' : '(optional)'}
                    </span>
                    {coverOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {coverOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-3 pb-3">
                          <ImageSourceFields
                            mode={coverMode}
                            onModeChange={(mode) => {
                              setCoverMode(mode);
                              if (mode === 'url') setCoverPreview(coverUrl || null);
                              else if (!coverFile) setCoverPreview(editingNews?.cover_image_url || null);
                            }}
                            urlValue={coverUrl}
                            onUrlChange={(value) => {
                              setCoverUrl(value);
                              setCoverPreview(value || null);
                            }}
                            fileInputRef={coverFileRef}
                            onFileChange={handleCoverFileChange}
                            previewUrl={coverPreview}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Article sections ({blocks.length})
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => addBlock('heading')}
                        className="px-2 py-1 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50"
                      >
                        + Heading
                      </button>
                      <button
                        type="button"
                        onClick={() => addBlock('paragraph')}
                        className="px-2 py-1 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50"
                      >
                        + Paragraph
                      </button>
                      <button
                        type="button"
                        onClick={() => addBlock('image')}
                        className="px-2 py-1 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50"
                      >
                        + Image
                      </button>
                    </div>
                  </div>

                  {blocks.length === 0 ? (
                    <div className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500">
                      Add a heading, paragraph, or image to build the article.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {blocks.map((block, index) => {
                        const isOpen = expandedBlocks[block.localKey] ?? false;
                        return (
                          <div key={block.localKey} className="rounded-md border border-gray-200 bg-gray-50/70">
                            <div className="flex items-center gap-2 px-2 py-1.5">
                              <button
                                type="button"
                                onClick={() => toggleBlock(block.localKey)}
                                className="flex-1 min-w-0 flex items-center gap-2 text-left"
                              >
                                {isOpen ? (
                                  <ChevronUpIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                ) : (
                                  <ChevronDownIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                                )}
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 flex-shrink-0">
                                  {index + 1}. {block.type}
                                </span>
                                <span className="text-xs text-gray-600 truncate">{blockPreviewLabel(block)}</span>
                              </button>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => moveBlock(block.localKey, -1)}
                                  disabled={index === 0}
                                  className="px-1.5 py-0.5 text-[10px] border rounded disabled:opacity-40"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveBlock(block.localKey, 1)}
                                  disabled={index === blocks.length - 1}
                                  className="px-1.5 py-0.5 text-[10px] border rounded disabled:opacity-40"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeBlock(block.localKey)}
                                  className="px-1.5 py-0.5 text-[10px] border border-red-300 text-red-600 rounded hover:bg-red-50"
                                >
                                  ×
                                </button>
                              </div>
                            </div>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  <div className="px-2 pb-2 space-y-2">
                                    {(block.type === 'heading' || block.type === 'paragraph') && (
                                      <AutoTextarea
                                        value={block.text}
                                        onChange={(value) => updateBlock(block.localKey, { text: value })}
                                        minRows={block.type === 'heading' ? 1 : 2}
                                        maxRows={block.type === 'heading' ? 4 : 16}
                                        placeholder={
                                          block.type === 'heading' ? 'Section heading' : 'Write this section...'
                                        }
                                        className="bg-white"
                                      />
                                    )}

                                    {block.type === 'image' && (
                                      <>
                                        <ImageSourceFields
                                          compact
                                          mode={blockImageModes[block.localKey] || 'upload'}
                                          onModeChange={(mode) =>
                                            setBlockImageModes((prev) => ({ ...prev, [block.localKey]: mode }))
                                          }
                                          urlValue={block.url.startsWith('data:') ? '' : block.url}
                                          onUrlChange={(value) => updateBlock(block.localKey, { url: value })}
                                          onFileChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setBlockImageFiles((prev) => ({ ...prev, [block.localKey]: file }));
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                updateBlock(block.localKey, { url: reader.result as string });
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                          previewUrl={block.url || null}
                                        />
                                        <input
                                          type="text"
                                          value={block.caption || ''}
                                          onChange={(e) => updateBlock(block.localKey, { caption: e.target.value })}
                                          placeholder="Optional caption"
                                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                                        />
                                      </>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => resetForm(false)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 font-medium"
                  >
                    {saving ? 'Saving...' : editingNews ? 'Update News' : 'Publish News'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {newsItems.length === 0 && !showForm ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No News Posts</h3>
          <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
            Create your first news update with a short summary, cover image, and structured sections.
          </p>
          <button
            onClick={openCreateForm}
            className="bg-yellow-600 text-white px-5 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm"
          >
            Add Your First News Post
          </button>
        </div>
      ) : (
        <DataTable
          data={newsItems}
          columns={[
            {
              key: 'title',
              label: 'News',
              sortable: true,
              render: (item: NewsRecord) => (
                <div className="flex items-center gap-2.5">
                  {item.cover_image_url ? (
                    <img
                      src={item.cover_image_url}
                      alt=""
                      className="h-9 w-12 rounded object-cover border border-gray-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-12 rounded bg-gray-100 border border-gray-200 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{item.title}</div>
                    <div className="text-xs text-gray-400 line-clamp-1 max-w-md">{item.summary}</div>
                  </div>
                </div>
              ),
            },
            {
              key: 'published_at',
              label: 'Published',
              sortable: true,
              render: (item: NewsRecord) => (
                <span className="text-sm text-gray-500">
                  {item.published_at
                    ? new Date(item.published_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </span>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              render: (item: NewsRecord) => (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.status ? 'Published' : 'Inactive'}
                </span>
              ),
            },
          ]}
          filters={[
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'true', label: 'Published' },
                { value: 'false', label: 'Inactive' },
              ],
            },
          ]}
          searchable
          searchPlaceholder="Search by title or summary..."
          pageSize={25}
          loading={loading}
          emptyMessage="No news posts found."
          actions={(item) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item);
                }}
                className="text-yellow-600 hover:text-yellow-800 px-2.5 py-1 rounded border border-yellow-600 hover:bg-yellow-50 transition-colors text-xs"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="text-red-600 hover:text-red-800 px-2.5 py-1 rounded border border-red-600 hover:bg-red-50 transition-colors text-xs"
              >
                Delete
              </button>
            </div>
          )}
          onRowClick={(item) => handleEdit(item)}
        />
      )}
    </div>
  );
}
