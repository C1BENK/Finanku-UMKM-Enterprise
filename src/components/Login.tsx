/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, Coffee } from 'lucide-react';
import { motion } from 'motion/react';
import Lottie from 'lottie-react';
import employeeAnimation from '../assets/employee_content.json';

interface LoginProps {
  onLogin: (role: 'owner' | 'staff', name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const u = username.toLowerCase().trim();
      const p = password.trim();

      if ((u === 'owner' || u === 'owner@finanku.com') && p === 'password') {
        onLogin('owner', 'Budi Santoso');
      } else if ((u === 'staff' || u === 'staff@finanku.com' || u === 'barista') && p === 'password') {
        onLogin('staff', 'Hendra (Barista)');
      } else {
        setError('Kredensial salah. Gunakan username "owner" atau "staff" dengan password "password".');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleQuickLogin = (role: 'owner' | 'staff') => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      if (role === 'owner') {
        onLogin('owner', 'Budi Santoso');
      } else {
        onLogin('staff', 'Hendra (Barista)');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans p-4 relative overflow-hidden">
      {/* Decorative premium radial circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Left Panel: Elegant Lottie Animation sidebar (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-slate-900 p-8 flex-col justify-between text-white relative overflow-hidden border-r border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent)] pointer-events-none" />
          
          {/* Header */}
          <div className="flex items-center gap-2.5 z-10">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-600/35">
              <span className="font-heading text-base tracking-wider">F</span>
            </div>
            <div>
              <h2 className="text-xs font-heading font-extrabold text-slate-100 tracking-tight">Finanku Enterprise</h2>
              <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Sistem Finansial Pintar</p>
            </div>
          </div>

          {/* Lottie Animation Area */}
          <div className="my-auto py-6 flex flex-col items-center justify-center text-center z-10">
            <div className="w-64 h-64 mx-auto mb-4 flex items-center justify-center">
              <Lottie 
                animationData={employeeAnimation} 
                loop={true} 
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <h3 className="text-sm font-extrabold text-slate-100 mb-1.5">Efisiensi Kolaborasi Tim</h3>
            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
              Pantau kinerja tim kasir, kelola shift barista, dan catat transaksi harian secara akurat dalam satu dashboard terintegrasi.
            </p>
          </div>

          {/* Footer branding */}
          <div className="text-[9px] text-slate-500 z-10">
            © 2026 Finanku Enterprise. Hak Cipta Dilindungi.
          </div>
        </div>

        {/* Right Panel: Login Form (Mobile & Desktop) */}
        <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-center">
          {/* Form Header */}
          <div className="space-y-1 text-center">
            {/* App logo shown on mobile only */}
            <div className="lg:hidden mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-600/35 mb-2">
              <span className="font-heading text-lg tracking-wider">F</span>
            </div>

            {/* Lottie shown on mobile only above title */}
            <div className="lg:hidden w-36 h-36 mx-auto flex items-center justify-center">
              <Lottie 
                animationData={employeeAnimation} 
                loop={true} 
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Selamat Datang Kembali</h3>
            <p className="text-xs text-slate-500">Silakan masukkan akun Anda untuk mengelola kas usaha</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-xs font-semibold flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="login-username" className="block text-xs font-semibold text-slate-600 mb-1.5">Username / Email</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="login-username"
                  type="text"
                  placeholder="owner / staff"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-600">Password</label>
                <span className="text-[10px] text-slate-400">Gunakan: password</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/15 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses Masuk...
                </>
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </form>

          {/* Quick Demo Access Options */}
          <div className="pt-5 border-t border-slate-100 space-y-3">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">Akses Cepat Demo Multi-Role</p>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Owner quick access */}
              <button
                type="button"
                onClick={() => handleQuickLogin('owner')}
                disabled={isLoading}
                className="p-3 text-left border border-slate-200 hover:border-indigo-400 bg-white rounded-xl transition-all cursor-pointer hover:shadow-sm"
              >
                <div className="flex items-center gap-1 text-slate-950 font-bold text-xs mb-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                  Owner Usaha
                </div>
                <p className="text-[9px] text-slate-400">Akses penuh: laporan keuangan, set anggaran & Asisten AI.</p>
              </button>

              {/* Staff quick access */}
              <button
                type="button"
                onClick={() => handleQuickLogin('staff')}
                disabled={isLoading}
                className="p-3 text-left border border-slate-200 hover:border-indigo-400 bg-white rounded-xl transition-all cursor-pointer hover:shadow-sm"
              >
                <div className="flex items-center gap-1 text-slate-950 font-bold text-xs mb-0.5">
                  <Coffee className="h-3.5 w-3.5 text-amber-600" />
                  Staff / Barista
                </div>
                <p className="text-[9px] text-slate-400">Akses terbatas: catat kas harian & cetak struk invoice saja.</p>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
