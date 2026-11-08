'use client';

import React, { useState, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type {
  BlogCategoryResource,
  BlogPostDetailResource,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from '@/types/blog';
import { blogApi } from '@/apiRequest/blog';
import { ArrowLeft, Upload, Image as ImageIcon, CheckCircle2, Search } from 'lucide-react';
import Switch from '@/components/ui/Switch';
import { TagInput } from '@/components/ui/TagInput';
import Button from '@/components/ui/Button';
import RichTextEditor from './RichTextEditor';
import { ROUTES } from '@/constants/routes';

interface AdminBlogEditorProps {
  initialPost?: BlogPostDetailResource;
  categories: BlogCategoryResource[];
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const COMMON_TAGS = [
  'Gross Net Salary',
  'ATS Resume',
  'Job Interview',
  'STAR Method',
  'Software Engineering',
  'Artificial Intelligence',
  'Career Roadmap',
  'Labor Law',
  'Probation',
  'Salary Negotiation',
];

export function AdminBlogEditor({ initialPost, categories }: AdminBlogEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialPost);

  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [slug, setSlug] = useState(initialPost?.slug ?? '');
  const [isSlugCustomized, setIsSlugCustomized] = useState(Boolean(initialPost?.slug));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? '');
  const [content, setContent] = useState(initialPost?.content ?? '');

  const [categoryId, setCategoryId] = useState<number>(
    initialPost?.category?.id ?? (categories.length > 0 ? categories[0].id : 1),
  );
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.coverImageUrl ?? '');
  const [coverImagePublicId, setCoverImagePublicId] = useState(initialPost?.coverImagePublicId ?? '');
  const [isFeatured, setIsFeatured] = useState(initialPost?.isFeatured ?? false);
  const [tags, setTags] = useState<string[]>(initialPost?.tags ?? []);
  const [authorName, setAuthorName] = useState(initialPost?.author?.name ?? 'InterVue Editorial Team');
  const [authorRole, setAuthorRole] = useState(initialPost?.author?.role ?? 'Career Strategy Lead');
  const [metaTitle, setMetaTitle] = useState(initialPost?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(initialPost?.metaDescription ?? '');

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustomized) {
      setSlug(slugify(val));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setErrorMsg(null);
    try {
      const res = await blogApi.uploadCoverImage(file);
      setCoverImageUrl(res.url);
      setCoverImagePublicId(res.publicId);
    } catch {
      setErrorMsg('Failed to upload cover image to Cloudinary. Please try again!');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      setErrorMsg('Please enter the article title!');
      return;
    }
    if (!excerpt.trim()) {
      setErrorMsg('Please enter a brief summary excerpt!');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Please enter the article content!');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const payload: CreateBlogPostInput | UpdateBlogPostInput = {
      categoryId,
      title: title.trim(),
      slug: slug.trim() || slugify(title.trim()),
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImageUrl: coverImageUrl || undefined,
      coverImagePublicId: coverImagePublicId || undefined,
      status,
      isFeatured,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      authorName: authorName.trim() || undefined,
      authorRole: authorRole.trim() || undefined,
      tags,
    };

    try {
      if (isEditing && initialPost) {
        await blogApi.updatePost(initialPost.id, payload);
      } else {
        await blogApi.createPost(payload);
      }

      startTransition(() => {
        router.push(ROUTES.ADMIN_CONTENT_BLOG);
        router.refresh();
      });
    } catch {
      setErrorMsg('An error occurred while saving the article. Please check the slug or input fields!');
      setIsSaving(false);
    }
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="space-y-6 pb-20">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.ADMIN_CONTENT_BLOG}
            className="border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-xl border bg-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-on-surface text-xl font-bold tracking-tight sm:text-2xl">
              {isEditing ? `Edit Article #${initialPost?.id}` : 'Create Career Guide Article'}
            </h1>
            <p className="text-on-surface-variant mt-0.5 text-xs">
              {isEditing
                ? 'Update content, refine formatting, and optimize publication metadata.'
                : 'Draft high-impact career guide content, format sections, and configure SEO.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => handleSave('DRAFT')} disabled={isSaving}>
            Save Draft
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave('PUBLISHED')}
            isLoading={isSaving}
            className="bg-primary hover:bg-[#009643]"
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            <span>Publish Now</span>
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (70%): Title, Slug, Excerpt, Rich Text Editor */}
        <div className="space-y-6 lg:col-span-8">
          <div className="border-outline-variant/80 rounded-2xl border bg-white p-5 shadow-2xs">
            <div className="space-y-4">
              <div>
                <label className="text-on-surface mb-1.5 block text-xs font-bold tracking-wider uppercase">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Complete Guide to Passing Technical Interviews with the STAR Method..."
                  className="border-outline-variant text-on-surface placeholder:text-outline focus:border-primary w-full rounded-xl border bg-white px-4 py-3 text-sm font-bold transition focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-none"
                />
              </div>

              <div>
                <div className="text-on-surface-variant mb-1 flex items-center justify-between text-xs">
                  <span className="font-semibold">Permalink (Slug):</span>
                  <button
                    type="button"
                    onClick={() => setIsSlugCustomized(!isSlugCustomized)}
                    className="text-primary font-medium hover:underline"
                  >
                    {isSlugCustomized ? 'Auto-generate from title' : 'Customize manually'}
                  </button>
                </div>
                <div className="border-outline-variant bg-surface-container-low/70 text-on-surface-variant flex items-center rounded-xl border px-3 py-2 text-xs">
                  <span className="text-outline shrink-0">/blog/{selectedCategory?.slug || 'category'}/</span>
                  <input
                    type="text"
                    value={slug}
                    disabled={!isSlugCustomized}
                    onChange={(e) => {
                      setIsSlugCustomized(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="article-url-slug"
                    className="text-on-surface disabled:text-on-surface-variant flex-1 bg-transparent px-1 font-mono font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-on-surface mb-1.5 block text-xs font-bold tracking-wider uppercase">
                  Summary Excerpt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise 2-3 sentence teaser highlighting the core takeaways and value for candidates..."
                  className="border-outline-variant text-on-surface placeholder:text-outline focus:border-primary w-full rounded-xl border bg-white p-3.5 text-xs leading-relaxed transition focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-on-surface block text-xs font-bold tracking-wider uppercase">
                Article Body Content <span className="text-rose-500">*</span>
              </label>
              <span className="text-label-sm text-outline">
                WYSIWYG Rich Editor • Format with Headings, Lists, Quotes & Links
              </span>
            </div>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Right Column (30%): Meta, Category, Cover, Tags, SEO */}
        <div className="space-y-6 lg:col-span-4">
          {/* Cover image */}
          <div className="border-outline-variant/80 rounded-2xl border bg-white p-5 shadow-2xs">
            <h3 className="text-on-surface text-xs font-bold tracking-wider uppercase">Cover Image</h3>

            <div className="mt-3">
              {coverImageUrl ? (
                <div className="border-outline-variant bg-surface-container-high relative aspect-video w-full overflow-hidden rounded-xl border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImageUrl} alt="Cover preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-label-sm absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1 font-semibold text-white backdrop-blur-xs transition hover:bg-black"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Change</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-outline-variant bg-surface-container-low/60 hover:border-primary flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition hover:bg-emerald-50/30"
                >
                  <div className="text-outline flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs">
                    {isUploadingCover ? (
                      <div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                    ) : (
                      <ImageIcon className="h-5 w-5" />
                    )}
                  </div>
                  <p className="text-on-surface mt-2 text-center text-xs font-semibold">
                    {isUploadingCover ? 'Uploading to Cloudinary...' : 'Click or drop cover image'}
                  </p>
                  <p className="text-label-sm text-outline mt-0.5 text-center">Supports PNG, JPG, WebP up to 5MB</p>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="border-outline-variant/80 space-y-4 rounded-2xl border bg-white p-5 shadow-2xs">
            <div>
              <label className="text-on-surface mb-1.5 block text-xs font-bold tracking-wider uppercase">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="border-outline-variant text-on-surface focus:border-primary w-full rounded-xl border bg-white p-2.5 text-xs font-semibold transition focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <TagInput label="Tags" placeholder="Type tag and press Enter..." value={tags} onChange={setTags} />

              <div className="mt-2 flex flex-wrap gap-1.5">
                {COMMON_TAGS.map((t) => {
                  const isSelected = tags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={isSelected}
                      onClick={() => setTags([...tags, t])}
                      className={`text-label-sm rounded-lg px-2 py-0.5 font-semibold transition ${
                        isSelected
                          ? 'bg-surface-container-high text-outline'
                          : 'text-primary cursor-pointer bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      +{t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-outline-variant border-t pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-on-surface text-xs font-bold">Featured Article</h4>
                  <p className="text-label-sm text-on-surface-variant">
                    Pin prominently on hero banner and category grid
                  </p>
                </div>
                <Switch checked={isFeatured} onChange={setIsFeatured} ariaLabel="Featured article" />
              </div>
            </div>
          </div>

          {/* Author Details */}
          <div className="border-outline-variant/80 space-y-3 rounded-2xl border bg-white p-5 shadow-2xs">
            <h3 className="text-on-surface text-xs font-bold tracking-wider uppercase">Author Details</h3>

            <div>
              <label className="text-label-sm text-on-surface-variant mb-1 block font-semibold">Author Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g., InterVue Editorial Team"
                className="border-outline-variant text-on-surface focus:border-primary w-full rounded-xl border bg-white p-2 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant mb-1 block font-semibold">Author Role</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g., Career Strategy Lead"
                className="border-outline-variant text-on-surface focus:border-primary w-full rounded-xl border bg-white p-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* SEO Preview */}
          <div className="border-outline-variant/80 space-y-3 rounded-2xl border bg-white p-5 shadow-2xs">
            <div className="text-on-surface flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <Search className="text-on-surface-variant h-3.5 w-3.5" />
              <span>Search Engine Result Preview (SEO)</span>
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant mb-1 block font-semibold">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || 'Page title displayed on search engines...'}
                className="border-outline-variant text-on-surface focus:border-primary w-full rounded-xl border bg-white p-2 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-label-sm text-on-surface-variant mb-1 block font-semibold">Meta Description</label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={excerpt || 'Brief snippet displayed on search engine results...'}
                className="border-outline-variant text-on-surface focus:border-primary w-full rounded-xl border bg-white p-2 text-xs focus:outline-none"
              />
            </div>

            <div className="border-outline-variant bg-surface-container-low/60 rounded-xl border p-3 text-left">
              <span className="text-label-sm text-outline">
                https://intervue.tech/blog/{selectedCategory?.slug}/{slug || 'slug'}
              </span>
              <h5 className="mt-0.5 line-clamp-1 text-xs font-bold text-blue-700">
                {metaTitle.trim() || title.trim() || 'Article Title'}
              </h5>
              <p className="text-label-sm text-on-surface-variant mt-1 line-clamp-2 leading-tight">
                {metaDescription.trim() ||
                  excerpt.trim() ||
                  'Article snippet as it will appear in search engine listings...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBlogEditor;
