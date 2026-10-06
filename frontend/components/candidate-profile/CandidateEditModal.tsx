'use client';

import { useState } from 'react';
import { Save, User, X } from 'lucide-react';
import type { CandidateProfile } from '@/types/candidate';

interface CandidateEditModalProps {
  candidate: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<CandidateProfile>) => void;
}

export default function CandidateEditModal({ candidate, isOpen, onClose, onSave }: CandidateEditModalProps) {
  const [fullName, setFullName] = useState(candidate.fullName);
  const [title, setTitle] = useState(candidate.title);
  const [phone, setPhone] = useState(candidate.phone);
  const [location, setLocation] = useState(candidate.location);
  const [bio, setBio] = useState(candidate.bio);
  const [status, setStatus] = useState(candidate.status);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      fullName,
      title,
      phone,
      location,
      bio,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e9eaec] bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00b14f]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#263a4d]">Chỉnh sửa hồ sơ cá nhân</h2>
              <p className="text-[12.5px] text-[#6f7882]">Cập nhật thông tin nhanh chóng trên InterVue</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6f7882] hover:bg-[#f1f5f9] hover:text-[#263a4d]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-[13.5px]">
          <div>
            <label className="block font-semibold text-[#263a4d]">Họ và tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-[#1e293b] focus:border-[#00b14f] focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-[#263a4d]">Chức danh nghề nghiệp (Title)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-[#1e293b] focus:border-[#00b14f] focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-[#263a4d]">Số điện thoại</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-[#1e293b] focus:border-[#00b14f] focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#263a4d]">Địa chỉ / Khu vực</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-[#1e293b] focus:border-[#00b14f] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#263a4d]">Trạng thái tìm việc</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CandidateProfile['status'])}
              className="mt-1 w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-[#1e293b] focus:border-[#00b14f] focus:outline-hidden"
            >
              <option value="actively_looking">Đang tìm việc làm (Bật đèn xanh cho NTD)</option>
              <option value="open_to_offers">Sẵn sàng nhận lời mời (Thụ động)</option>
              <option value="not_looking">Tạm đóng hồ sơ (Đã có việc)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#263a4d]">Giới thiệu bản thân (Bio)</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#e2e8f0] px-3.5 py-2.5 text-[#1e293b] focus:border-[#00b14f] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 font-semibold text-[#64748b] hover:bg-[#f8fafc]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#00b14f] px-6 py-2.5 font-semibold text-white shadow-xs hover:bg-[#009643]"
            >
              <Save className="h-4 w-4" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
