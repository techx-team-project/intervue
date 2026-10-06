'use client';

import { ExternalLink, FolderGit2, Sparkles } from 'lucide-react';
import type { CandidateProject } from '@/types/candidate';

const GithubIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

interface CandidateProjectsSectionProps {
  projects: CandidateProject[];
  isOwner?: boolean;
  onAddProject?: () => void;
}

export default function CandidateProjectsSection({
  projects,
  isOwner = true,
  onAddProject,
}: CandidateProjectsSectionProps) {
  return (
    <div className="rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-xs sm:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#263a4d] sm:text-xl">Dự án tiêu biểu</h2>
            <p className="text-[12.5px] text-[#6f7882]">Sản phẩm thực tế và các dự án mã nguồn mở đã thực hiện</p>
          </div>
        </div>

        {isOwner && onAddProject && (
          <button
            type="button"
            onClick={onAddProject}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e9eaec] bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[#00b14f] transition-all hover:border-[#00b14f] hover:bg-[#f2fbf6]"
          >
            <span>+ Thêm dự án</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="flex flex-col justify-between rounded-2xl border border-[#e9eaec] bg-[#fbfcfd] p-5 transition-all hover:border-[#00b14f] hover:bg-white hover:shadow-md"
          >
            <div>
              {/* Top: Name & Links */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1e293b]">{proj.name}</h3>
                  <div className="text-[12px] font-semibold text-[#00b14f]">{proj.role}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#475569] transition-colors hover:border-[#00b14f] hover:text-[#00b14f]"
                      title="Mã nguồn GitHub"
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#475569] transition-colors hover:border-[#00b14f] hover:text-[#00b14f]"
                      title="Xem Live Demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-[13px] leading-relaxed text-[#475569]">{proj.description}</p>

              {/* Highlights */}
              {proj.highlights.length > 0 && (
                <div className="mt-3 space-y-1 rounded-xl border border-[#f1f5f9] bg-white p-3">
                  {proj.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[12px] text-[#334155]">
                      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-[#00b14f]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tech Stack */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-[#f1f5f9] pt-3">
              {proj.technologies.map((t, i) => (
                <span
                  key={i}
                  className="rounded-md border border-[#e2e8f0] bg-white px-2 py-0.5 text-[11px] font-medium text-[#475569]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
