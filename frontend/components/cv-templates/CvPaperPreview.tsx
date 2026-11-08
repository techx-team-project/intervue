'use client';

import React from 'react';
import { CvTemplateSampleData } from '@/types/cv-template';
import { CV_TEMPLATE_MESSAGES } from '@/constants/cv-templates';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Wrench } from 'lucide-react';

interface CvPaperPreviewProps {
  sampleData: CvTemplateSampleData;
  primaryColor: string;
  isMini?: boolean;
}

export default function CvPaperPreview({ sampleData, primaryColor, isMini = false }: CvPaperPreviewProps) {
  const { sections } = CV_TEMPLATE_MESSAGES.preview;

  if (isMini) {
    return (
      <div className="text-label-sm relative aspect-[1/1.414] w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-3.5 leading-tight text-gray-700 shadow-inner select-none">
        <div className="mb-2.5 rounded-lg p-2 text-white" style={{ backgroundColor: primaryColor }}>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border border-white/40 bg-white/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                decoding="async"
                src={sampleData.avatar}
                alt={sampleData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="text-label-sm line-clamp-1 font-bold tracking-wide">{sampleData.name}</div>
              <div className="text-label-sm line-clamp-1 text-white/90">{sampleData.title}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-8 space-y-2">
            <div>
              <div
                className="text-label-sm border-b pb-0.5 font-bold"
                style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
              >
                {sections.careerObjective}
              </div>
              <p className="text-label-sm mt-1 line-clamp-2 text-gray-600">{sampleData.summary}</p>
            </div>

            <div>
              <div
                className="text-label-sm border-b pb-0.5 font-bold"
                style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
              >
                {sections.workExperience}
              </div>
              {sampleData.experience.slice(0, 1).map((exp, idx) => (
                <div key={idx} className="mt-1 space-y-0.5">
                  <div className="text-label-sm line-clamp-1 font-semibold text-gray-900">{exp.role}</div>
                  <div className="text-label-sm line-clamp-1 text-gray-500">
                    {exp.company} • {exp.period}
                  </div>
                  <ul className="text-label-sm mt-0.5 space-y-0.5 text-gray-600">
                    {exp.highlights.slice(0, 2).map((h, hIdx) => (
                      <li key={hIdx} className="line-clamp-1 flex items-start gap-1">
                        <span
                          className="mt-1 h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <div
                className="text-label-sm border-b pb-0.5 font-bold"
                style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
              >
                {sections.education}
              </div>
              {sampleData.education.slice(0, 1).map((edu, idx) => (
                <div key={idx} className="text-label-sm mt-1">
                  <div className="line-clamp-1 font-semibold text-gray-900">{edu.degree}</div>
                  <div className="text-label-sm line-clamp-1 text-gray-500">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4 space-y-2 border-l border-gray-100 pl-1.5">
            <div>
              <div
                className="text-label-sm border-b pb-0.5 font-bold"
                style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
              >
                {sections.contact}
              </div>
              <div className="text-label-sm mt-1 space-y-0.5 text-gray-600">
                <div className="line-clamp-1">{sampleData.phone}</div>
                <div className="line-clamp-1">{sampleData.address}</div>
              </div>
            </div>

            <div>
              <div
                className="text-label-sm border-b pb-0.5 font-bold"
                style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
              >
                {sections.skills}
              </div>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {sampleData.skills.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-label-sm rounded px-1 py-0.5 font-medium"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shadow-elevation-2 aspect-[1/1.414] w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-xs leading-relaxed text-gray-800 sm:p-10 sm:text-sm">
      <div
        className="shadow-elevation-1 mb-6 rounded-2xl p-6 text-white sm:p-7"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              decoding="async"
              src={sampleData.avatar}
              alt={sampleData.name}
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-white/30 sm:h-20 sm:w-20"
            />
            <div>
              <h2 className="text-lg font-bold tracking-wide uppercase sm:text-2xl">{sampleData.name}</h2>
              <p className="mt-0.5 text-xs font-medium text-white/90 sm:text-sm">{sampleData.title}</p>
            </div>
          </div>

          <div className="space-y-1 border-t border-white/20 pt-2 text-xs text-white/90 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{sampleData.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{sampleData.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{sampleData.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 sm:col-span-8">
          <div>
            <h3
              className="flex items-center gap-1.5 border-b-2 pb-1 text-xs font-bold tracking-wider uppercase sm:text-sm"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <Award className="h-4 w-4" />
              {sections.careerObjectiveFull}
            </h3>
            <p className="mt-2 text-justify text-xs text-gray-600">{sampleData.summary}</p>
          </div>

          <div>
            <h3
              className="flex items-center gap-1.5 border-b-2 pb-1 text-xs font-bold tracking-wider uppercase sm:text-sm"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <Briefcase className="h-4 w-4" />
              {sections.workExperienceFull}
            </h3>
            <div className="mt-3 space-y-4">
              {sampleData.experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex flex-col justify-between gap-0.5 sm:flex-row sm:items-center">
                    <span className="text-xs font-bold text-gray-900 sm:text-sm">{exp.role}</span>
                    <span className="text-label-sm font-medium text-gray-500">{exp.period}</span>
                  </div>
                  <div className="text-xs font-semibold" style={{ color: primaryColor }}>
                    {exp.company}
                  </div>
                  <ul className="mt-1.5 space-y-1 pl-1 text-xs text-gray-600">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-1.5">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3
              className="flex items-center gap-1.5 border-b-2 pb-1 text-xs font-bold tracking-wider uppercase sm:text-sm"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <GraduationCap className="h-4 w-4" />
              {sections.educationFull}
            </h3>
            <div className="mt-3 space-y-2">
              {sampleData.education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{edu.degree}</span>
                    <span className="text-label-sm font-normal text-gray-500">{edu.period}</span>
                  </div>
                  <div className="text-gray-600">{edu.school}</div>
                  {edu.gpa && <div className="text-label-sm text-primary font-medium">{edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 space-y-6 border-gray-100 sm:col-span-4 sm:border-l sm:pl-5">
          <div>
            <h3
              className="flex items-center gap-1.5 border-b-2 pb-1 text-xs font-bold tracking-wider uppercase"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <Wrench className="h-3.5 w-3.5" />
              {sections.skillsFull}
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {sampleData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-label-sm rounded-md px-2 py-1 font-medium"
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {sampleData.languages && (
            <div>
              <h3
                className="border-b-2 pb-1 text-xs font-bold tracking-wider uppercase"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                {sections.languages}
              </h3>
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                {sampleData.languages.map((lang, idx) => (
                  <div key={idx}>• {lang}</div>
                ))}
              </div>
            </div>
          )}

          {sampleData.certifications && (
            <div>
              <h3
                className="border-b-2 pb-1 text-xs font-bold tracking-wider uppercase"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                {sections.certifications}
              </h3>
              <div className="mt-2 space-y-1.5 text-xs text-gray-600">
                {sampleData.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-start gap-1">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
