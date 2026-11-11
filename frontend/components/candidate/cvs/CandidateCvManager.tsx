'use client';

import { candidateCvApi } from '@/apiRequest/candidate-cv';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import AiCvProfileModal from '@/components/candidate-profile/AiCvProfileModal';
import { MAX_RESUMES } from '@/constants/candidate-application';
import { useCandidateCvMutations, useCandidateCvs } from '@/hooks/useCandidateCvs';
import type { CandidateResume } from '@/types/candidate-application';
import { formatDate } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { Download, FileText, Pencil, Sparkles, Star, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const MB = 1024 * 1024;

function sizeLabel(bytes: number) {
  return `${(bytes / MB).toFixed(1)} MB`;
}

export default function CandidateCvManager() {
  const { data: resumes, isLoading, isError, error, refetch } = useCandidateCvs();
  const { upload, rename, setDefault, remove } = useCandidateCvMutations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState('');
  const [deleting, setDeleting] = useState<CandidateResume | null>(null);
  const [aiModalResumeId, setAiModalResumeId] = useState<number | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const canUpload = (resumes?.length ?? 0) < MAX_RESUMES;
  const fail = (cause: unknown) => toast.error(getErrorMessage(cause));

  const handleDownload = async (resume: CandidateResume) => {
    try {
      const blob = await candidateCvApi.download(resume.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume.fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (cause) {
      fail(cause);
    }
  };

  const commitRename = (resume: CandidateResume) => {
    const fileName = draftName.trim();
    setEditingId(null);
    if (!fileName || fileName === resume.fileName) return;
    rename.mutate({ id: resume.id, fileName }, { onSuccess: () => toast.success('Đã đổi tên CV.'), onError: fail });
  };

  const confirmDelete = () => {
    if (!deleting) return;
    remove.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Đã xóa CV.');
        setDeleting(null);
      },
      onError: fail,
    });
  };

  return (
    <div className="container-topcv max-w-3xl space-y-5 py-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-navy text-2xl font-black">CV của tôi</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tối đa {MAX_RESUMES} CV dạng PDF (5 MB). CV mặc định được chọn sẵn khi ứng tuyển.
          </p>
        </div>
        <Button
          isLoading={upload.isPending}
          disabled={!canUpload}
          leftIcon={<Upload className="h-4 w-4" />}
          onClick={() => inputRef.current?.click()}
        >
          Tải CV lên
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          aria-label="Chọn tệp CV PDF"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) upload.mutate(file, { onSuccess: () => toast.success('Đã tải CV lên.'), onError: fail });
          }}
        />
      </header>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-rose-700">{getErrorMessage(error)}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử lại
          </Button>
        </div>
      ) : resumes && resumes.length > 0 ? (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          {resumes.map((resume) => (
            <li key={resume.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
                <div className="min-w-0 flex-1">
                  {editingId === resume.id ? (
                    <input
                      autoFocus
                      value={draftName}
                      maxLength={150}
                      aria-label="Tên CV"
                      onChange={(event) => setDraftName(event.target.value)}
                      onBlur={() => commitRename(resume)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') commitRename(resume);
                        if (event.key === 'Escape') setEditingId(null);
                      }}
                      className="h-9 w-full rounded-lg border border-emerald-600 px-3 text-sm focus:outline-none"
                    />
                  ) : (
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <span className="truncate">{resume.fileName}</span>
                      {resume.isDefault && (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Mặc định
                        </span>
                      )}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">
                    {sizeLabel(resume.fileSizeBytes)} · {formatDate(resume.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {!resume.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Đặt làm mặc định"
                    title="Đặt làm mặc định"
                    onClick={() => setDefault.mutate(resume.id, { onError: fail })}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Đổi tên"
                  title="Đổi tên"
                  onClick={() => {
                    setDraftName(resume.fileName);
                    setEditingId(resume.id);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Tải xuống"
                  title="Tải xuống"
                  onClick={() => handleDownload(resume)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Cập nhật hồ sơ bằng AI"
                  title="Cập nhật hồ sơ bằng AI từ CV này"
                  className="text-primary hover:bg-primary-light"
                  onClick={() => {
                    setAiModalResumeId(resume.id);
                    setIsAiModalOpen(true);
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" aria-label="Xóa" title="Xóa" onClick={() => setDeleting(resume)}>
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <FileText className="h-9 w-9 text-slate-300" aria-hidden />
          <p className="text-sm font-semibold text-slate-700">Bạn chưa có CV nào</p>
          <p className="text-xs text-slate-500">Tải lên CV dạng PDF để ứng tuyển nhanh hơn.</p>
        </div>
      )}

      <Modal
        isOpen={deleting !== null}
        onClose={() => setDeleting(null)}
        maxWidth="sm"
        title="Xóa CV này?"
        description={deleting?.fileName}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Hủy
            </Button>
            <Button variant="danger" isLoading={remove.isPending} onClick={confirmDelete}>
              Xóa
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">Các hồ sơ đã nộp vẫn giữ bản sao CV riêng và không bị ảnh hưởng.</p>
      </Modal>

      <AiCvProfileModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setAiModalResumeId(null);
        }}
        initialResumeId={aiModalResumeId}
      />
    </div>
  );
}
