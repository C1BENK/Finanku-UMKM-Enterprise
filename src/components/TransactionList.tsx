/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah, generateId } from '../utils';
import { INDONESIAN_EXPENSE_CATEGORIES, INDONESIAN_INCOME_CATEGORIES } from '../mockData';

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Transaction) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function TransactionList({ 
  transactions, 
  onAddTransaction, 
  onEditTransaction, 
  onDeleteTransaction 
}: TransactionListProps) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [date, setDate] = useState('2026-07-06');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState(INDONESIAN_INCOME_CATEGORIES[0]);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'Transfer Bank' | 'E-Wallet' | 'QRIS'>('QRIS');

  // Available categories based on selected type
  const availableCategories = useMemo(() => {
    return type === 'income' ? INDONESIAN_INCOME_CATEGORIES : INDONESIAN_EXPENSE_CATEGORIES;
  }, [type]);

  // Sync category when type changes in form
  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setCategory(newType === 'income' ? INDONESIAN_INCOME_CATEGORIES[0] : INDONESIAN_EXPENSE_CATEGORIES[0]);
  };

  // Get all unique categories from all transactions for the filter dropdown
  const filterCategories = useMemo(() => {
    const cats = new Set<string>();
    transactions.forEach(t => cats.add(t.category));
    return Array.from(cats);
  }, [transactions]);

  // Filter & Search Logic
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search query
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        t => 
          t.description.toLowerCase().includes(query) || 
          t.category.toLowerCase().includes(query)
      );
    }

    // Filter Type
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    // Filter Category
    if (filterCategory !== 'all') {
      result = result.filter(t => t.category === filterCategory);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOrder === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOrder === 'amount-desc') {
        return b.amount - a.amount;
      } else {
        return a.amount - b.amount;
      }
    });

    return result;
  }, [transactions, searchTerm, filterType, filterCategory, sortOrder]);

  // Submit Handler (Add or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Jumlah nominal transaksi harus lebih besar dari 0');
      return;
    }

    const transactionData: Transaction = {
      id: editingId || generateId('t'),
      date,
      type,
      category,
      amount,
      description: description || (type === 'income' ? 'Pemasukan Tanpa Deskripsi' : 'Pengeluaran Tanpa Deskripsi'),
      paymentMethod,
    };

    if (editingId) {
      onEditTransaction(transactionData);
      setEditingId(null);
    } else {
      onAddTransaction(transactionData);
    }

    // Reset Form
    resetForm();
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setDate('2026-07-06');
    setType('income');
    setCategory(INDONESIAN_INCOME_CATEGORIES[0]);
    setAmount(0);
    setDescription('');
    setPaymentMethod('QRIS');
  };

  // Populate form for editing
  const handleEditClick = (t: Transaction) => {
    setEditingId(t.id);
    setDate(t.date);
    setType(t.type);
    setCategory(t.category);
    setAmount(t.amount);
    setDescription(t.description);
    setPaymentMethod(t.paymentMethod);
    setIsFormOpen(true);
    
    // Scroll smoothly to form
    const formElement = document.getElementById('transaction-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-950">Pencatatan Transaksi Harian</h1>
          <p className="text-xs text-slate-500">Catat semua pemasukan & pengeluaran kas UMKM secara transparan</p>
        </div>
        {!isFormOpen && (
          <button 
            id="add-transaction-btn"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/15 transition-all self-start sm:self-center"
          >
            <Plus className="h-4 w-4" />
            Catat Transaksi Baru
          </button>
        )}
      </div>

      {/* Elegant Collapsible Form Card */}
      {isFormOpen && (
        <div id="transaction-form" className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-base font-heading font-bold text-slate-950">
              {editingId ? 'Edit Transaksi Keuangan' : 'Catat Transaksi Baru'}
            </h2>
            <button 
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jenis Transaksi</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('income')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      type === 'income' 
                        ? 'bg-emerald-500 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('expense')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      type === 'expense' 
                        ? 'bg-rose-500 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Pengeluaran
                  </button>
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label htmlFor="tx-date" className="block text-xs font-semibold text-slate-600 mb-1.5">Tanggal</label>
                <input
                  id="tx-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 text-slate-800"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label htmlFor="tx-method" className="block text-xs font-semibold text-slate-600 mb-1.5">Metode Pembayaran</label>
                <select
                  id="tx-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 text-slate-800"
                >
                  <option value="QRIS">QRIS</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Tunai">Tunai</option>
                  <option value="E-Wallet">E-Wallet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="tx-category" className="block text-xs font-semibold text-slate-600 mb-1.5">Kategori</label>
                <select
                  id="tx-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 text-slate-800"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Amount Nominal */}
              <div className="md:col-span-2">
                <label htmlFor="tx-amount" className="block text-xs font-semibold text-slate-600 mb-1.5">Jumlah Nominal (Rupiah)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    id="tx-amount"
                    type="number"
                    value={amount === 0 ? '' : amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="tx-description" className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi / Keterangan</label>
              <input
                id="tx-description"
                type="text"
                placeholder="Contoh: Pembelian cup sablon kopi 500 pcs atau Omset penjualan cafe harian"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/10 transition-all"
              >
                {editingId ? 'Simpan Perubahan' : 'Catat Transaksi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar Dashboard */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari transaksi berdasarkan deskripsi atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Tipe</option>
              <option value="income">Pemasukan Saja</option>
              <option value="expense">Pengeluaran Saja</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              {filterCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-none"
            >
              <option value="date-desc">Terbaru (Tanggal)</option>
              <option value="date-asc">Terlama (Tanggal)</option>
              <option value="amount-desc">Nominal Terbesar</option>
              <option value="amount-asc">Nominal Terkecil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 text-slate-300" />
            <h3 className="text-sm font-semibold text-slate-700">Tidak ada transaksi ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold">
                  <th className="py-3 px-5">Tipe</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4 text-right">Jumlah</th>
                  <th className="py-3 px-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-5">
                      {t.type === 'income' ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <ArrowUpRight className="h-3 w-3" />
                          Pemasukan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          <ArrowDownLeft className="h-3 w-3" />
                          Pengeluaran
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {t.date}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {t.category}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={t.description}>
                      {t.description}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {t.paymentMethod}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                      t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                    }`}>
                      {t.type === 'income' ? '+' : '-'} {formatRupiah(t.amount)}
                    </td>
                    <td className="py-3 px-5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(t)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"
                          title="Edit transaksi"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
                              onDeleteTransaction(t.id);
                            }
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-rose-600 rounded-lg transition-colors"
                          title="Hapus transaksi"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
