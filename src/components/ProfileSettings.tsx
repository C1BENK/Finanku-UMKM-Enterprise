/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  CheckCircle, 
  Save, 
  Settings, 
  Coins, 
  Coffee 
} from 'lucide-react';
import { BusinessProfile } from '../types';
import { formatRupiah } from '../utils';

interface ProfileSettingsProps {
  profile: BusinessProfile;
  onUpdateProfile: (profile: BusinessProfile) => void;
}

export default function ProfileSettings({ profile, onUpdateProfile }: ProfileSettingsProps) {
  const [name, setName] = useState(profile.name);
  const [industry, setIndustry] = useState(profile.industry);
  const [monthlyBudget, setMonthlyBudget] = useState(profile.monthlyBudget);
  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (monthlyBudget < 0) return;

    onUpdateProfile({
      name,
      industry,
      currency: 'IDR',
      monthlyBudget,
      ownerName,
    });

    setNotification('Konfigurasi bisnis UMKM berhasil diperbarui! Perubahan telah diterapkan di seluruh sistem.');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-950">Pengaturan Profil & Anggaran</h1>
        <p className="text-xs text-slate-500">Sesuaikan profil bisnis dan pagu anggaran bulanan untuk memantau performa usaha.</p>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Settings Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-heading font-bold text-slate-950">Identitas Usaha & Finansial</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Name */}
            <div>
              <label htmlFor="set-name" className="block text-xs font-semibold text-slate-600 mb-1">Nama Brand / Toko UMKM</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="set-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kopi Nusantara Sentosa"
                  className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold"
                  required
                />
              </div>
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="set-owner" className="block text-xs font-semibold text-slate-600 mb-1">Nama Pemilik Usaha</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="set-owner"
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Budi Santoso"
                  className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Industry selector */}
            <div>
              <label htmlFor="set-industry" className="block text-xs font-semibold text-slate-600 mb-1">Kategori Sektor Usaha</label>
              <div className="relative">
                <Coffee className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <select
                  id="set-industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as any)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                >
                  <option value="Kuliner (F&B)">Kuliner (F&B)</option>
                  <option value="Ritel / Toko Klontong">Ritel / Toko Klontong</option>
                  <option value="Jasa / Servis">Jasa / Servis</option>
                  <option value="Kerajinan / Kriya">Kerajinan / Kriya</option>
                  <option value="Fashion & Pakaian">Fashion & Pakaian</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            {/* Monthly budget target */}
            <div>
              <label htmlFor="set-budget" className="block text-xs font-semibold text-slate-600 mb-1">Pagu Anggaran Belanja Bulanan (Rp)</label>
              <div className="relative">
                <Coins className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="set-budget"
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  placeholder="15000000"
                  className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-bold"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Batas pengeluaran bulanan yang dianjurkan (Anggaran Juli). Saat ini: <strong>{formatRupiah(monthlyBudget)}</strong>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/15 transition-all"
            >
              <Save className="h-4 w-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      {/* Metodologi Box */}
      <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Metodologi Penganggaran Bulanan</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          Pencatatan pagu anggaran bulanan membantu usaha mikro mengantisipasi defisit arus kas secara dini. Sistem akan secara otomatis memicu diagnosis peringatan jika akumulasi pengeluaran operasional dan bahan baku telah melampaui batas aman dari pagu anggaran yang telah ditentukan.
        </p>
      </div>
    </div>
  );
}
