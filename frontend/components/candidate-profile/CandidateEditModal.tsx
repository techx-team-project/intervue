'use client';

import React, { useState } from 'react';
import { Save, User } from 'lucide-react';
import type { CandidateProfile } from '@/types/candidate';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Chỉnh sửa hồ sơ cá nhân</h2>
            <p className="text-xs text-slate-500">Cập nhật thông tin nhanh chóng trên InterVue</p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <Input label="Họ và tên" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />

        <Input
          label="Chức danh nghề nghiệp (Title)"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Số điện thoại" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />

          <Input
            label="Địa chỉ / Khu vực"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">Trạng thái tìm việc</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CandidateProfile['status'])}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none"
          >
            <option value="actively_looking">Đang tìm việc làm (Bật đèn xanh cho NTD)</option>
            <option value="open_to_offers">Sẵn sàng nhận lời mời (Thụ động)</option>
            <option value="not_looking">Tạm đóng hồ sơ (Đã có việc)</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">Giới thiệu bản thân (Bio)</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" leftIcon={<Save className="h-4 w-4" />}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
}
