/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Percent, 
  CheckCircle2, 
  AlertCircle, 
  Calculator, 
  Briefcase, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  HeartPulse
} from 'lucide-react';
import { Transaction, BusinessProfile } from '../types';
import { formatRupiah, calculateTotals } from '../utils';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

interface DashboardOverviewProps {
  transactions: Transaction[];
  profile: BusinessProfile;
  onNavigate: (tab: 'transactions' | 'reports' | 'ai-advisor') => void;
}

export default function DashboardOverview({ transactions, profile, onNavigate }: DashboardOverviewProps) {
  // Simulator state
  const [salesGrowth, setSalesGrowth] = useState<number>(0); // -50% to +100%
  const [costReduction, setCostReduction] = useState<number>(0); // 0% to 50%

  // Filter current month transactions (assuming July 2026 based on mock data and server time)
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(t => t.date.startsWith('2026-07'));
  }, [transactions]);

  const lastMonthTransactions = useMemo(() => {
    return transactions.filter(t => t.date.startsWith('2026-06'));
  }, [transactions]);

  // Calculations
  const currentTotals = useMemo(() => calculateTotals(currentMonthTransactions), [currentMonthTransactions]);
  const lastMonthTotals = useMemo(() => calculateTotals(lastMonthTransactions), [lastMonthTransactions]);

  const allTimeTotals = useMemo(() => calculateTotals(transactions), [transactions]);

  // Expenses by Category
  const expenseByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [currentMonthTransactions]);

  const totalExpenseThisMonth = currentTotals.totalExpense;
  const budgetUtilization = useMemo(() => {
    if (profile.monthlyBudget <= 0) return 0;
    return Math.min(Math.round((totalExpenseThisMonth / profile.monthlyBudget) * 100), 100);
  }, [totalExpenseThisMonth, profile.monthlyBudget]);

  // Calculate health ratios
  const profitMargin = useMemo(() => {
    if (currentTotals.totalIncome === 0) return 0;
    return Math.round((currentTotals.netBalance / currentTotals.totalIncome) * 100);
  }, [currentTotals]);

  const costToIncomeRatio = useMemo(() => {
    if (currentTotals.totalIncome === 0) return 0;
    return Math.round((currentTotals.totalExpense / currentTotals.totalIncome) * 100);
  }, [currentTotals]);

  // Recharts structured timeline data
  const chartData = useMemo(() => {
    // Generate simple timeline representation of July 2026
    const days = Array.from({ length: 7 }, (_, i) => `2026-07-0${i + 1}`);
    let cumulativeIncome = 0;
    let cumulativeExpense = 0;

    return days.map(day => {
      const dailyTransactions = transactions.filter(t => t.date === day);
      const dayIncome = dailyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const dayExpense = dailyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      cumulativeIncome += dayIncome;
      cumulativeExpense += dayExpense;

      const displayDay = day.split('-')[2]; // just day number e.g. "01"

      return {
        tanggal: `Tgl ${displayDay}`,
        Pemasukan: dayIncome,
        Pengeluaran: dayExpense,
        Akumulasi_Laba: cumulativeIncome - cumulativeExpense,
      };
    });
  }, [transactions]);

  // Simulator results
  const simulatedResults = useMemo(() => {
    const baseIncome = currentTotals.totalIncome;
    const baseExpense = currentTotals.totalExpense;

    const simulatedIncome = baseIncome * (1 + salesGrowth / 100);
    const simulatedExpense = baseExpense * (1 - costReduction / 100);
    const simulatedNet = simulatedIncome - simulatedExpense;
    const simulatedMargin = simulatedIncome > 0 ? Math.round((simulatedNet / simulatedIncome) * 100) : 0;

    return {
      income: simulatedIncome,
      expense: simulatedExpense,
      net: simulatedNet,
      margin: simulatedMargin,
    };
  }, [currentTotals, salesGrowth, costReduction]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div id="welcome-banner" className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-200 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-indigo-500/30 border border-indigo-400/20 rounded-full text-xs font-semibold text-indigo-300">
                Sistem Enterprise Aktif
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight mb-1 text-slate-100">
              Halo, {profile.ownerName || 'Pengusaha Sukses'}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Selamat datang kembali di dashboard keuangan <span className="text-white font-medium">{profile.name}</span>. Kelola pembukuan, arus kas, dan pantau kesehatan bisnis Anda secara cerdas.
            </p>
          </div>
          <button 
            id="ai-consultation-shortcut-btn"
            onClick={() => onNavigate('ai-advisor')}
            className="flex items-center gap-2 self-start md:self-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 border border-indigo-500"
          >
            <Sparkles className="h-4 w-4 text-indigo-200" />
            Tanya AI Advisor
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Saldo Kas */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Saldo Kas UMKM</span>
            <div className="p-2 bg-slate-100 rounded-xl">
              <Wallet className="h-5 w-5 text-slate-600" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {formatRupiah(allTimeTotals.netBalance)}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Akumulasi Total</span>
              <span>dari seluruh kas</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pemasukan Bulan Ini */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Pemasukan Juli</span>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-emerald-600">
              {formatRupiah(currentTotals.totalIncome)}
            </h3>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-emerald-600 font-semibold flex items-center">
                +Rp 1.85jt
              </span>
              <span className="text-slate-500">vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Card 3: Pengeluaran Bulan Ini */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Pengeluaran Juli</span>
            <div className="p-2 bg-rose-50 rounded-xl">
              <TrendingDown className="h-5 w-5 text-rose-600" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-rose-600">
              {formatRupiah(currentTotals.totalExpense)}
            </h3>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-rose-600 font-semibold">
                -Rp 3.10jt
              </span>
              <span className="text-slate-500">vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Card 4: Sisa Anggaran Bulanan */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Batas Anggaran Juli</span>
            <div className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              {budgetUtilization}% terpakai
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {formatRupiah(profile.monthlyBudget - currentTotals.totalExpense)}
              </h3>
              <p className="text-[11px] text-slate-500">
                Sisa dari pagu {formatRupiah(profile.monthlyBudget)}
              </p>
            </div>
            {/* Custom mini progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetUtilization > 85 ? 'bg-rose-500' : budgetUtilization > 60 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${budgetUtilization}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div id="charts-and-breakdown-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-lg font-heading font-bold text-slate-950">Grafik Arus Kas Bulanan (Juli)</h2>
              <p className="text-xs text-slate-500">Visualisasi harian pendapatan vs pengeluaran UMKM</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-3 h-3 bg-indigo-500/25 rounded-full border border-indigo-500 inline-block"></span>
                Akumulasi Laba
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-3 h-3 bg-emerald-500 rounded-full inline-block"></span>
                Pemasukan
              </span>
            </div>
          </div>

          {/* Recharts Wrapper */}
          <div className="h-64 sm:h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="tanggal" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [formatRupiah(Number(value)), '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', border: 'none' }}
                />
                <Area type="monotone" dataKey="Akumulasi_Laba" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
                <Area type="monotone" dataKey="Pemasukan" stroke="#10b981" strokeWidth={1} fill="#10b981" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rerata Transaksi Harian: <strong>{formatRupiah(currentTotals.totalIncome / 7)}</strong></span>
            <button 
              onClick={() => onNavigate('transactions')}
              className="text-indigo-600 hover:text-indigo-500 font-semibold flex items-center gap-0.5"
            >
              Lihat Detail Transaksi <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right: Expense Category & Health Metrics */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-950 mb-1">Distribusi Pengeluaran</h2>
            <p className="text-xs text-slate-500 mb-5">Ke mana uang usaha mengalir paling banyak bulan ini</p>
            
            {expenseByCategory.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">Belum ada pengeluaran dicatat bulan ini</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenseByCategory.slice(0, 4).map((item, index) => {
                  const percent = Math.round((item.value / totalExpenseThisMonth) * 100);
                  const colors = [
                    'bg-indigo-600',
                    'bg-amber-500',
                    'bg-emerald-500',
                    'bg-rose-500'
                  ];
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="font-semibold text-slate-950">{formatRupiah(item.value)} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${colors[index % colors.length]}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Metrik Kesehatan Finansial</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Percent className="h-3.5 w-3.5 text-slate-400" />
                  Net Profit Margin
                </div>
                <div className="text-base font-bold text-slate-900">
                  {profitMargin}%
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Target ideal: &gt;15%
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <HeartPulse className="h-3.5 w-3.5 text-slate-400" />
                  Cost-to-Income
                </div>
                <div className="text-base font-bold text-slate-900">
                  {costToIncomeRatio}%
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {costToIncomeRatio < 60 ? 'Sangat Efisien' : 'Perlu Dihemat'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive What-If Simulator Widget */}
      <div id="what-if-simulator" className="bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-50/40 border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-heading font-bold text-slate-950">Simulator Proyeksi Laba UMKM</h2>
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-full">Simulasi Skenario Bisnis</span>
        </div>
        <p className="text-xs text-slate-600 mb-6 max-w-2xl">
          Simulasikan target bisnis Anda di bawah ini! Geser slider untuk memproyeksikan dampak peningkatan omset penjualan atau langkah efisiensi biaya terhadap laba bersih bulanan secara instan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
          {/* Controls */}
          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Peningkatan Penjualan (Omset):</span>
                <span className="text-indigo-600">+{salesGrowth}%</span>
              </div>
              <input 
                type="range" 
                min="-50" 
                max="100" 
                value={salesGrowth} 
                onChange={(e) => setSalesGrowth(Number(e.target.value))}
                className="w-full h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-50% (Skenario Terburuk)</span>
                <span>Normal</span>
                <span>+100% (Skenario Terbaik)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Efisiensi / Pengurangan Biaya Operasional:</span>
                <span className="text-amber-600">-{costReduction}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={costReduction} 
                onChange={(e) => setCostReduction(Number(e.target.value))}
                className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Sama dengan Sekarang)</span>
                <span>Langkah Penghematan Sedang</span>
                <span>50% (Maksimum Penghematan)</span>
              </div>
            </div>
          </div>

          {/* Simulated Outputs */}
          <div className="bg-white border border-indigo-100 p-5 rounded-xl shadow-inner space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hasil Proyeksi Laba Baru</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Pemasukan Baru:</span>
                <span className="font-semibold text-slate-900">{formatRupiah(simulatedResults.income)}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Pengeluaran Baru:</span>
                <span className="font-semibold text-slate-900">{formatRupiah(simulatedResults.expense)}</span>
              </div>
              <div className="flex justify-between text-sm pt-1">
                <span className="font-bold text-slate-800">Laba Bersih Baru:</span>
                <span className={`font-bold ${simulatedResults.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatRupiah(simulatedResults.net)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Margin Laba Baru:</span>
                <span className="font-bold text-slate-700">{simulatedResults.margin}%</span>
              </div>
            </div>

            <div className="pt-2">
              <span className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 ${
                simulatedResults.net > currentTotals.netBalance 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                  : 'bg-slate-50 text-slate-600 border border-slate-100'
              }`}>
                {simulatedResults.net > currentTotals.netBalance ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Kenaikan Laba: +{Math.round(((simulatedResults.net - currentTotals.netBalance) / (currentTotals.netBalance || 1)) * 100)}%!
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
                    Belum ada perubahan kenaikan
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
