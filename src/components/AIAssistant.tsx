/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight,
  RefreshCw,
  Percent
} from 'lucide-react';
import { Transaction, BusinessProfile } from '../types';
import { formatRupiah, calculateTotals, generateId } from '../utils';

interface AIAssistantProps {
  transactions: Transaction[];
  profile: BusinessProfile;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isQuickAction?: boolean;
}

export default function AIAssistant({ transactions, profile }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Calculate live financial figures to feed into the AI's brain
  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const currentMonthTransactions = useMemo(() => transactions.filter(t => t.date.startsWith('2026-07')), [transactions]);
  const currentTotals = useMemo(() => calculateTotals(currentMonthTransactions), [currentMonthTransactions]);

  // Expenses categories breakdown
  const expenseBreakdown = useMemo(() => {
    const categories: Record<string, number> = {};
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    return categories;
  }, [currentMonthTransactions]);

  const rawMaterialsExpense = expenseBreakdown['Bahan Baku'] || 0;
  const rawMaterialsRatio = useMemo(() => {
    if (currentTotals.totalIncome === 0) return 0;
    return Math.round((rawMaterialsExpense / currentTotals.totalIncome) * 100);
  }, [rawMaterialsExpense, currentTotals.totalIncome]);

  // Seed initial welcome messages
  useEffect(() => {
    setMessages([
      {
        id: 'msg-init-1',
        sender: 'ai',
        text: `Halo Pak/Bu ${profile.ownerName || 'Pengusaha'}! Saya adalah Asisten Keuangan Finanku khusus untuk UMKM ${profile.name}.\n\nSaya telah memindai ${transactions.length} catatan transaksi keuangan aktif dalam database Anda.\n\nSilakan pilih beberapa opsi analisis cepat di bawah ini atau ketik pertanyaan kustom Anda!`,
        timestamp: 'Sekarang'
      }
    ]);
  }, [profile, transactions.length]);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Preset action questions
  const PRESET_QUESTIONS = [
    {
      q: 'Bagaimana kondisi kesehatan keuangan usaha saya bulan ini?',
      key: 'health'
    },
    {
      q: 'Bagaimana rasio pengeluaran bahan baku kopi/makanan saya?',
      key: 'materials'
    },
    {
      q: 'Beri saya 3 saran penghematan biaya taktis.',
      key: 'saving'
    },
    {
      q: 'Apakah anggaran bulanan saya aman?',
      key: 'budget'
    }
  ];

  // AI response engine that responds dynamically based on real numbers!
  const getAIResponse = (key: string, customQuestion?: string): string => {
    const net = currentTotals.netBalance;
    const isProfit = net >= 0;

    if (key === 'health') {
      return `### Analisis Kesehatan Finansial Juli 2026

Berdasarkan pencatatan kas aktif untuk **${profile.name}**:
1. Arus Kas Masuk (Omset): ${formatRupiah(currentTotals.totalIncome)}
2. Arus Kas Keluar (Beban): ${formatRupiah(currentTotals.totalExpense)}
3. Laba Bersih Berjalan: **${formatRupiah(net)}** (Status: ${isProfit ? 'Surplus Operasional' : 'Defisit Operasional'})

**Analisis Finansial**:
Sektor usaha Anda beroperasi di bidang **${profile.industry}**. Saat ini Margin Keuntungan Bersih Anda berada di kisaran **${currentTotals.totalIncome > 0 ? Math.round((net / currentTotals.totalIncome) * 100) : 0}%**. 

*Rekomendasi:* ${
        isProfit 
          ? `Pertahankan efisiensi ini. Volume penjualan katering dan event berkontribusi besar. Pertimbangkan memutar 20% keuntungan untuk beriklan di area lokal guna menumbuhkan bisnis.` 
          : `Anda mengalami defisit minor bulan ini. Pengeluaran bulanan didominasi oleh pos operasional tetap. Silakan tinjau pos pengeluaran rutin atau pertimbangkan negosiasi ulang biaya sewa tempat.`
      }`;
    }

    if (key === 'materials') {
      return `### Evaluasi Belanja Bahan Baku (COGS)

Biaya Bahan Baku bulan ini tercatat sebesar **${formatRupiah(rawMaterialsExpense)}** yang merupakan **${rawMaterialsRatio}%** dari total omset penjualan Anda.

**Saran Khusus Sektor Kuliner (F&B)**:
* Rasio ideal bahan baku untuk bisnis kopi/F&B adalah **25% - 35%** dari harga jual produk.
* Rasio Anda saat ini adalah **${rawMaterialsRatio}%**. ${
        rawMaterialsRatio > 35 
          ? `Rasio pengeluaran Anda sedikit di atas batas ideal. Anda disarankan melakukan negosiasi ulang dengan supplier biji kopi atau susu untuk pembelian partai besar (bulk buy), atau menyesuaikan harga menu retail sekitar Rp 1.500 - Rp 2.000 per porsi.` 
          : `Sangat efisien! Pengadaan bahan baku Anda berjalan optimal. Anda memiliki ruang keuntungan yang cukup aman untuk mengadakan promo bundling kreatif guna menaikkan volume transaksi.`
      }`;
    }

    if (key === 'saving') {
      return `### 3 Saran Penghematan Taktis untuk ${profile.name}

1. **Konsolidasi Vendor Pengadaan**: Alihkan pengadaan bahan baku harian (susu cair, pastry) ke sistem pengiriman berkala mingguan langsung dari distributor besar. Potensi efisiensi pengeluaran modal mencapai **8% - 12%**.
2. **Optimalisasi Pemasaran Organik**: Fokuskan sumber daya pemasaran Anda pada konten video pendek kreatif (Reels/TikTok) guna meningkatkan eksposur brand lokal secara organik tanpa membengkakkan pengeluaran iklan.
3. **Penyelarasan Konsumsi Utilitas**: Kurangi pemakaian daya listrik ganda di luar jam sibuk kedai. Matikan peralatan sekunder yang sedang tidak terpakai pada rentang waktu sepi pengunjung untuk memotong tagihan listrik hingga **15%**.`;
    }

    if (key === 'budget') {
      const budgetUsed = Math.round((currentTotals.totalExpense / profile.monthlyBudget) * 100);
      const remaining = profile.monthlyBudget - currentTotals.totalExpense;
      return `### Audit Kepatuhan Anggaran (Budgeting)

* Pagu Anggaran Bulanan: ${formatRupiah(profile.monthlyBudget)}
* Belanja Terpakai: ${formatRupiah(currentTotals.totalExpense)} (${budgetUsed}% terpakai)
* Sisa Anggaran: **${formatRupiah(remaining)}**

**Status Anggaran**: ${
        budgetUsed > 80 
          ? `Alokasi Anggaran Menipis. Anda telah menggunakan ${budgetUsed}% pagu di awal/tengah bulan. Batasi pengeluaran diskresioner non-mendesak untuk mencegah overbudget.` 
          : budgetUsed > 50 
          ? `Peringatan Sedang. Pengeluaran terkendali namun mendekati batas aman pertengahan bulan. Tunda pembelian alat/perkakas baru hingga siklus anggaran berikutnya.` 
          : `Anggaran Sangat Aman. Sisa anggaran Anda sebesar ${formatRupiah(remaining)} masih sangat longgar dan aman untuk operasional kedai.`
      }`;
    }

    // Default custom response if they ask anything else
    return `### Hasil Analisis Keuangan Finanku

Terima kasih atas pertanyaan Anda mengenai *"**${customQuestion}**"*. Berikut adalah rincian data neraca berjalan Anda:

* **Sektor Industri**: ${profile.industry}
* **Saldo Kas Konsolidasi**: **${formatRupiah(totals.netBalance)}**
* **Rasio Profit Margin**: **${currentTotals.totalIncome > 0 ? Math.round((net / currentTotals.totalIncome) * 100) : 0}%**

**Rekomendasi Keuangan**:
Berdasarkan parameter operasional ${profile.name}, usaha Anda memiliki fleksibilitas arus kas yang memadai. Untuk memaksimalkan laba bersih, disarankan agar kas yang mengendap dialokasikan sebesar 15% untuk penyediaan alat penunjang produktivitas (capital expenditure), dan 10% untuk dana darurat cair guna mengantisipasi fluktuasi harga bahan baku di pasar retail lokal.`;
  };

  // Handle Question Send
  const handleSend = (text: string, isPreset: boolean = false, key: string = '') => {
    if (!text.trim()) return;

    // 1. Add user message
    const userMsg: Message = {
      id: generateId('msg-user'),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. Mock AI typing and answer
    setTimeout(() => {
      const aiReply = getAIResponse(isPreset ? key : 'custom', text);
      const aiMsg: Message = {
        id: generateId('msg-ai'),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Upper AI advisor Hero Panel */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-950 p-6 rounded-2xl shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/30 rounded-lg text-indigo-300">
              <Bot className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-heading font-bold text-slate-100">Konsultan Keuangan Virtual</h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Asisten cerdas berbasis AI untuk memantau performa keuangan, mendeteksi tren arus kas, mengaudit pengeluaran bahan baku (COGS), dan merancang rekomendasi penghematan operasional secara instan.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-lg flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Modul Aktif
          </div>
        </div>
      </div>

      {/* Main chat layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Auto Insights Board */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm h-[500px] flex flex-col">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-amber-500" /> Diagnosis Keuangan
          </h3>

          <div className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
            {/* Cashflow health indicator */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Arus Kas Sehat
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Pemasukan Juli senilai {formatRupiah(currentTotals.totalIncome)} sanggup menutup seluruh pengeluaran bulanan {formatRupiah(currentTotals.totalExpense)} dengan surplus laba bersih {formatRupiah(currentTotals.netBalance)}.
              </p>
            </div>

            {/* Expenses Warning */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Saran Penghematan
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Biaya Bahan Baku ({formatRupiah(rawMaterialsExpense)}) memakan {rawMaterialsRatio}% dari omset Anda. Hubungi distributor untuk mendapat potongan harga grosir.
              </p>
            </div>

            {/* Industry KPI Benchmarking */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <Percent className="h-4 w-4 text-indigo-500" />
                Sektor Kuliner
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Margin profit bersih rata-rata kedai kopi mikro adalah 18%. Bisnis Anda mencetak profit margin {currentTotals.totalIncome > 0 ? Math.round((currentTotals.netBalance / currentTotals.totalIncome) * 100) : 0}%.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Smart Interactive Chat Engine */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm h-[500px] flex flex-col overflow-hidden">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center ${
                    isAi ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  {/* Bubble wrapper */}
                  <div className="space-y-1">
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isAi 
                        ? 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none whitespace-pre-wrap' 
                        : 'bg-indigo-600 text-white rounded-tr-none'
                    }`}>
                      {/* Simple custom markdown renderer representation */}
                      {msg.text.split('\n').map((line, idx) => {
                        if (line.startsWith('###')) {
                          return <h4 key={idx} className="font-heading font-extrabold text-slate-900 mt-2 mb-1.5 text-sm">{line.replace('###', '')}</h4>;
                        }
                        if (line.startsWith('* **')) {
                          return <li key={idx} className="ml-2 list-disc text-slate-700 mt-1">{line.replace('* **', '**')}</li>;
                        }
                        if (line.startsWith('*')) {
                          return <li key={idx} className="ml-2 list-disc text-slate-700 mt-1">{line.replace('*', '')}</li>;
                        }
                        if (line.startsWith('1.')) {
                          return <p key={idx} className="pl-2 font-medium text-slate-700">{line}</p>;
                        }
                        return <p key={idx} className="mb-1">{line}</p>;
                      })}
                    </div>
                    <p className={`text-[9px] text-slate-400 px-1 ${isAi ? 'text-left' : 'text-right'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* AI Typing Loader Indicator */}
            {isTyping && (
              <div className="flex gap-3 self-start mr-auto">
                <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white shrink-0 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 text-slate-500 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5 shadow-sm">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-500" />
                  Sistem sedang memproses data transaksi Anda...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Preset Buttons Row */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-2">
            {PRESET_QUESTIONS.map((pq) => (
              <button
                key={pq.key}
                onClick={() => handleSend(pq.q, true, pq.key)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-700 text-[10px] text-slate-600 rounded-full font-medium transition-colors cursor-pointer"
              >
                {pq.q}
              </button>
            ))}
          </div>

          {/* Chat text Input panel */}
          <div className="p-4 border-t border-slate-150 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend(inputValue);
                  }
                }}
                placeholder="Tulis pertanyaan bisnis, misal: 'Berapa anggaran sewa ruko ideal?'..."
                className="flex-1 px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
              />
              <button
                onClick={() => handleSend(inputValue)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                Kirim <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-slate-400 text-center mt-2.5">
              Klik tombol preset di atas untuk melihat analisis keuangan secara instan!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
