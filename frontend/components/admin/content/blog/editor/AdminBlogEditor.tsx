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
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Edit3,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  Sparkles,
  Search,
} from 'lucide-react';
import Switch from '@/components/ui/Switch';
import { TagInput } from '@/components/ui/TagInput';
import Button from '@/components/ui/Button';
import MarkdownArticleContent from '@/components/blog/detail/MarkdownArticleContent';
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
  'Lương Gross Net',
  'CV chuẩn ATS',
  'Phỏng vấn',
  'Mô hình STAR',
  'Marketing',
  'IT / AI',
  'Mô hình Ikigai',
  'Bảo hiểm xã hội',
  'Thử việc',
  'Đàm phán lương',
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
  const [authorName, setAuthorName] = useState(initialPost?.author?.name ?? 'Ban Biên Tập InterVue');
  const [authorRole, setAuthorRole] = useState(initialPost?.author?.role ?? 'Biên tập viên');
  const [metaTitle, setMetaTitle] = useState(initialPost?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(initialPost?.metaDescription ?? '');

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
      setErrorMsg('Không thể tải ảnh bìa lên Cloudinary. Vui lòng thử lại!');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const insertSnippet = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const replacement = `${prefix}${selected || 'nội dung'}${suffix}`;

    const updated = content.slice(0, start) + replacement + content.slice(end);
    setContent(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'nội dung').length);
    }, 10);
  };

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề bài viết!');
      return;
    }
    if (!excerpt.trim()) {
      setErrorMsg('Vui lòng nhập trích dẫn tóm tắt (excerpt)!');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Vui lòng nhập nội dung bài viết!');
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
      setErrorMsg('Đã xảy ra lỗi khi lưu bài viết. Vui lòng kiểm tra lại slug hoặc thông tin!');
      setIsSaving(false);
    }
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.ADMIN_CONTENT_BLOG}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {isEditing ? `Chỉnh sửa bài viết #${initialPost?.id}` : 'Tạo bài viết Cẩm nang mới'}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              {isEditing
                ? 'Cập nhật nội dung, tối ưu SEO và cấu hình xuất bản bài viết.'
                : 'Soạn thảo nội dung cẩm nang chất lượng, chèn công cụ và tối ưu hóa SEO.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => handleSave('DRAFT')} disabled={isSaving}>
            Lưu bản nháp
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave('PUBLISHED')}
            isLoading={isSaving}
            className="bg-[#00b14f] hover:bg-[#009643]"
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            <span>Xuất bản ngay</span>
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Cột trái (70%): Soạn thảo trọng tâm */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ví dụ: Trọn bộ bí quyết viết CV chuyên nghiệp chuẩn ATS 2026..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition placeholder:text-slate-400 focus:border-[#00b14f] focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-none"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold">Đường dẫn tĩnh (Slug):</span>
                  <button
                    type="button"
                    onClick={() => setIsSlugCustomized(!isSlugCustomized)}
                    className="font-medium text-[#00b14f] hover:underline"
                  >
                    {isSlugCustomized ? 'Tự động tạo theo tiêu đề' : 'Tùy chỉnh thủ công'}
                  </button>
                </div>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-500">
                  <span className="shrink-0 text-slate-400">/blog/{selectedCategory?.slug || 'category'}/</span>
                  <input
                    type="text"
                    value={slug}
                    disabled={!isSlugCustomized}
                    onChange={(e) => {
                      setIsSlugCustomized(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="duong-dan-bai-viet"
                    className="flex-1 bg-transparent px-1 font-mono font-medium text-slate-800 focus:outline-none disabled:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Trích dẫn tóm tắt (Excerpt) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn 2 - 3 câu nêu bật giá trị cốt lõi của bài viết để kích thích người đọc..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs leading-relaxed text-slate-800 transition placeholder:text-slate-400 focus:border-[#00b14f] focus:ring-2 focus:ring-[#00b14f]/20 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Trình soạn thảo Markdown */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeTab === 'write' ? 'bg-white text-[#00b14f] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Soạn thảo (Markdown)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeTab === 'preview'
                      ? 'bg-white text-[#00b14f] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Xem trước</span>
                </button>
              </div>

              {activeTab === 'write' && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertSnippet('## ', '\n')}
                    title="Heading 2 (##)"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800"
                  >
                    <Heading2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('### ', '\n')}
                    title="Heading 3 (###)"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800"
                  >
                    <Heading3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('**', '**')}
                    title="In đậm (**text**)"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('*', '*')}
                    title="In nghiêng (*text*)"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('- ', '\n')}
                    title="Danh sách gạch đầu dòng"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet('> 💡 **Điểm cốt lõi:** ', '\n')}
                    title="Hộp lưu ý nổi bật (Highlight)"
                    className="rounded-lg p-1.5 text-[#00b14f] hover:bg-emerald-50"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-5">
              {activeTab === 'write' ? (
                <textarea
                  ref={textareaRef}
                  rows={20}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung bài viết theo định dạng Markdown...
## 1. Tiêu đề mục chính
*Đoạn dẫn nhập nổi bật*
Nội dung chi tiết giải thích cho người đọc...

> 💡 **Điểm cốt lõi:** Lời khuyên quan trọng nhất cần ghi nhớ.

- Gạch đầu dòng thứ nhất
- Gạch đầu dòng thứ hai"
                  className="w-full font-mono text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              ) : (
                <div className="max-w-none">
                  {content.trim() ? (
                    <MarkdownArticleContent content={content} />
                  ) : (
                    <p className="py-10 text-center text-xs text-slate-400">Chưa có nội dung để xem trước.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cột phải (30%): Cấu hình metadata */}
        <div className="space-y-6 lg:col-span-4">
          {/* Ảnh bìa */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <h3 className="text-xs font-bold tracking-wider text-slate-700 uppercase">
              Ảnh bìa bài viết (Cover Image)
            </h3>

            <div className="mt-3">
              {coverImageUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImageUrl} alt="Cover preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs transition hover:bg-black"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Thay đổi</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 transition hover:border-[#00b14f] hover:bg-emerald-50/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-2xs">
                    {isUploadingCover ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#00b14f] border-t-transparent" />
                    ) : (
                      <ImageIcon className="h-5 w-5" />
                    )}
                  </div>
                  <p className="mt-2 text-center text-xs font-semibold text-slate-700">
                    {isUploadingCover ? 'Đang tải lên Cloudinary...' : 'Bấm để tải ảnh bìa lên'}
                  </p>
                  <p className="mt-0.5 text-center text-[10px] text-slate-400">Hỗ trợ PNG, JPG, WebP tối đa 5MB</p>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </div>
          </div>

          {/* Phân loại & Tags */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                Chuyên mục <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 transition focus:border-[#00b14f] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <TagInput label="Thẻ tag (Tags)" placeholder="Nhập tag rồi ấn Enter..." value={tags} onChange={setTags} />

              <div className="mt-2 flex flex-wrap gap-1.5">
                {COMMON_TAGS.map((t) => {
                  const isSelected = tags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={isSelected}
                      onClick={() => setTags([...tags, t])}
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold transition ${
                        isSelected
                          ? 'bg-slate-100 text-slate-400'
                          : 'cursor-pointer bg-emerald-50 text-[#00b14f] hover:bg-emerald-100'
                      }`}
                    >
                      +{t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Ghim bài nổi bật (Featured)</h4>
                  <p className="text-[11px] text-slate-500">Hiển thị ưu tiên trên Banner và Grid trang chủ</p>
                </div>
                <Switch checked={isFeatured} onChange={setIsFeatured} ariaLabel="Ghim bài nổi bật" />
              </div>
            </div>
          </div>

          {/* Tác giả */}
          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <h3 className="text-xs font-bold tracking-wider text-slate-700 uppercase">Thông tin tác giả</h3>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-600">Tên tác giả</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ví dụ: Ban Biên Tập InterVue"
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-600">Chức danh tác giả</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Ví dụ: Chuyên gia Hướng nghiệp"
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-none"
              />
            </div>
          </div>

          {/* Mô phỏng SEO Google */}
          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-700 uppercase">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <span>Xem trước tìm kiếm Google (SEO)</span>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-600">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || 'Tiêu đề hiển thị trên Google...'}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-600">Meta Description</label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={excerpt || 'Đoạn mô tả ngắn hiển thị trên Google...'}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-[#00b14f] focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-left">
              <span className="text-[10px] text-slate-400">
                https://intervue.tech/blog/{selectedCategory?.slug}/{slug || 'slug'}
              </span>
              <h5 className="mt-0.5 line-clamp-1 text-xs font-bold text-blue-700">
                {metaTitle.trim() || title.trim() || 'Tiêu đề bài viết'}
              </h5>
              <p className="mt-1 line-clamp-2 text-[11px] leading-tight text-slate-600">
                {metaDescription.trim() ||
                  excerpt.trim() ||
                  'Mô tả bài viết xuất hiện trên kết quả tìm kiếm của Google...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminBlogEditor;
