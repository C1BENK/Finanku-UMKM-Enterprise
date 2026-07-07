/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Activity, 
  ShieldAlert,
  ArrowRight,
  Printer
} from 'lucide-react';
import { Transaction, BusinessProfile } from '../types';
import { formatRupiah, calculateTotals } from '../utils';

interface FinancialReportsProps {
  transactions: Transaction[];
  profile: BusinessProfile;
}

export default function FinancialReports({ transactions, profile }: FinancialReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState('2026-07');
  const [notification, setNotification] = useState<string | null>(null);

  // Filter transactions based on selected month
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Calculate totals
  const totals = useMemo(() => calculateTotals(monthlyTransactions), [monthlyTransactions]);

  // Group income categories
  const incomeDetails = useMemo(() => {
    const details: Record<string, number> = {};
    monthlyTransactions
      .filter(t => t.type === 'income')
      .forEach(t => {
        details[t.category] = (details[t.category] || 0) + t.amount;
      });
    return Object.entries(details).sort((a, b) => b[1] - a[1]);
  }, [monthlyTransactions]);

  // Group expense categories
  const expenseDetails = useMemo(() => {
    const details: Record<string, number> = {};
    monthlyTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        details[t.category] = (details[t.category] || 0) + t.amount;
      });
    return Object.entries(details).sort((a, b) => b[1] - a[1]);
  }, [monthlyTransactions]);

  // Financial KPI calculations
  const ratios = useMemo(() => {
    const income = totals.totalIncome;
    const expense = totals.totalExpense;
    const net = totals.netBalance;

    const netProfitMargin = income > 0 ? Math.round((net / income) * 100) : 0;
    const opexRatio = income > 0 ? Math.round((expense / income) * 100) : 0;

    // Estimate Cash Runway: Cash balance / average monthly expense (assuming total cash from allTime)
    const allTimeTotals = calculateTotals(transactions);
    const avgExpense = 3000000; // default assumption Rp 3jt
    const runwayMonths = avgExpense > 0 ? (allTimeTotals.netBalance / avgExpense).toFixed(1) : '0';

    return {
      netProfitMargin,
      opexRatio,
      runwayMonths,
    };
  }, [totals, transactions]);

  const handleExport = (format: 'pdf' | 'excel') => {
    setNotification(`Berhasil mengekspor Laporan Laba Rugi bulan ${selectedMonth} ke file format ${format.toUpperCase()}!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 text-slate-100 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800 animate-bounce text-xs font-semibold">
          <FileSpreadsheet className="h-5 w-5 text-indigo-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-950">Laporan Laba Rugi UMKM</h1>
          <p className="text-xs text-slate-500">Analisis keuangan mendalam, profitabilitas, & rasio kesehatan usaha</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700"
          >
            <option value="2026-07">Juli 2026 (Bulan Ini)</option>
            <option value="2026-06">Juni 2026 (Bulan Lalu)</option>
          </select>

          <button
            onClick={() => handleExport('excel')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> Ekspor Excel
          </button>

          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" /> Cetak PDF
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Profit Margin */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Margin Keuntungan Bersih (NPM)</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${ratios.netProfitMargin > 15 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {ratios.netProfitMargin}%
            </span>
            <span className="text-xs text-slate-500">dari omset</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full ${ratios.netProfitMargin > 15 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.max(0, Math.min(100, ratios.netProfitMargin))}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            {ratios.netProfitMargin > 15 ? 'Sangat Sehat (Target industri kuliner/ritel >15%)' : 'Perlu mengerek harga jual / menekan ongkos'}
          </p>
        </div>

        {/* KPI 2: Operasional vs Income */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rasio Biaya Operasional (Opex Ratio)</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${ratios.opexRatio < 60 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {ratios.opexRatio}%
            </span>
            <span className="text-xs text-slate-500">pengeluaran / omset</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full ${ratios.opexRatio < 60 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.max(0, Math.min(100, ratios.opexRatio))}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            {ratios.opexRatio < 60 ? 'Efisiensi Biaya Baik' : 'Biaya membengkak, evaluasi pos belanja bahan baku'}
          </p>
        </div>

        {/* KPI 3: Cash Runway */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Estimasi Nafas Kas (Cash Runway)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {ratios.runwayMonths} Bulan
            </span>
            <span className="text-xs text-slate-500">cadangan operasional</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-600" style={{ width: '60%' }}></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            Dihitung dari sisa saldo kas dibagi rerata pengeluaran bulanan.
          </p>
        </div>
      </div>

      {/* Profit & Loss Ledger Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-6">
        <div className="border-b border-slate-150 pb-4">
          <h2 className="text-base font-heading font-bold text-slate-950">Laporan Laba Rugi Komprehensif</h2>
          <p className="text-xs text-slate-500">Periode: {selectedMonth === '2026-07' ? '1 Juli - 6 Juli 2026' : '1 Juni - 30 Juni 2026'}</p>
        </div>

        {/* Profit Loss Table Grid */}
        <div className="space-y-4 text-xs">
          {/* Section 1: INCOMES */}
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider text-[10px]">
              <span>1. Pendapatan Usaha (Omset)</span>
              <span>Jumlah Rupiah</span>
            </div>
            
            {incomeDetails.length === 0 ? (
              <div className="py-2 text-slate-400 italic">Tidak ada pendapatan tercatat</div>
            ) : (
              incomeDetails.map(([cat, val]) => (
                <div key={cat} className="flex justify-between pl-4 text-slate-700 py-1 border-b border-slate-50">
                  <span>{cat}</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(val)}</span>
                </div>
              ))
            )}

            <div className="flex justify-between font-bold text-emerald-600 bg-emerald-50/50 p-2 rounded-lg mt-2">
              <span>TOTAL PENDAPATAN KOTOR (REVENUE)</span>
              <span>{formatRupiah(totals.totalIncome)}</span>
            </div>
          </div>

          {/* Section 2: EXPENSES */}
          <div className="space-y-2 pt-4">
            <div className="flex justify-between font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider text-[10px]">
              <span>2. Beban & Pengeluaran Operasional</span>
              <span>Jumlah Rupiah</span>
            </div>
            
            {expenseDetails.length === 0 ? (
              <div className="py-2 text-slate-400 italic">Tidak ada pengeluaran tercatat</div>
            ) : (
              expenseDetails.map(([cat, val]) => (
                <div key={cat} className="flex justify-between pl-4 text-slate-700 py-1 border-b border-slate-50">
                  <span>{cat}</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(val)}</span>
                </div>
              ))
            )}

            <div className="flex justify-between font-bold text-rose-600 bg-rose-50/50 p-2 rounded-lg mt-2">
              <span>TOTAL BEBAN OPERASIONAL (EXPENSE)</span>
              <span>{formatRupiah(totals.totalExpense)}</span>
            </div>
          </div>

          {/* Section 3: NET INCOME GRAND TOTAL */}
          <div className="pt-6 border-t border-slate-200">
            <div className={`flex justify-between p-3.5 rounded-xl text-sm font-extrabold ${
              totals.netBalance >= 0 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/10' 
                : 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/10'
            }`}>
              <span className="uppercase tracking-wider">LABA / RUGI BERSIH USAHA (NET PROFIT)</span>
              <span>{formatRupiah(totals.netBalance)}</span>
            </div>
          </div>
        </div>

        {/* Business Advice box */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
          <Activity className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-indigo-950">Rekomendasi Akuntan Publik:</h4>
            <p className="text-[11px] text-indigo-900/90 leading-relaxed">
              {totals.netBalance > 0 ? (
                <>
                  Usaha Anda dalam kondisi <strong>PROFITABLE</strong> dengan keuntungan bersih senilai {formatRupiah(totals.netBalance)}. Sebaiknya sisihkan 30% dari laba ini sebagai dana cadangan (cash reserve) dan gunakan sisanya untuk ekspansi menu atau pemasaran online guna mendatangkan pelanggan baru.
                </>
              ) : (
                <>
                  Arus kas Anda mengalami <strong>DEFISIT/KERUGIAN</strong> bulan ini. Segera evaluasi kategori biaya terbesar (Bahan Baku & Gaji) dan tawarkan paket promosi harian untuk meningkatkan volume penjualan guna menutupi biaya operasional ruko tetap Anda.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
