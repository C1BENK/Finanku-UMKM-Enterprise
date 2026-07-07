/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, Invoice, BusinessProfile } from './types';

export const INITIAL_PROFILE: BusinessProfile = {
  name: 'Kopi Nusantara Sentosa',
  industry: 'Kuliner (F&B)',
  currency: 'IDR',
  monthlyBudget: 15000000, // Rp 15.000.000 limit for expenses
  ownerName: 'Budi Santoso',
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't-1',
    date: '2026-07-01',
    type: 'income',
    category: 'Penjualan Retail',
    amount: 1450000,
    description: 'Omset penjualan kopi susu & pastry offline',
    paymentMethod: 'QRIS',
  },
  {
    id: 't-2',
    date: '2026-07-02',
    type: 'expense',
    category: 'Bahan Baku',
    amount: 850000,
    description: 'Pembelian biji kopi Arabika & susu UHT karton',
    paymentMethod: 'Transfer Bank',
  },
  {
    id: 't-3',
    date: '2026-07-02',
    type: 'income',
    category: 'Penjualan Event / Catering',
    amount: 3200000,
    description: 'Catering kopi untuk meeting instansi pemerintah',
    paymentMethod: 'Transfer Bank',
  },
  {
    id: 't-4',
    date: '2026-07-03',
    type: 'expense',
    category: 'Operasional',
    amount: 250000,
    description: 'Pembelian cup plastik sablon, sedotan ramah lingkungan',
    paymentMethod: 'Tunai',
  },
  {
    id: 't-5',
    date: '2026-07-03',
    type: 'expense',
    category: 'Utilitas & Listrik',
    amount: 600000,
    description: 'Bayar token listrik ruko dan tagihan air PDAM',
    paymentMethod: 'E-Wallet',
  },
  {
    id: 't-6',
    date: '2026-07-04',
    type: 'income',
    category: 'Penjualan Online',
    amount: 980000,
    description: 'Pendapatan via GrabFood / GoFood minggu ini',
    paymentMethod: 'E-Wallet',
  },
  {
    id: 't-7',
    date: '2026-07-05',
    type: 'expense',
    category: 'Pemasaran & Iklan',
    amount: 400000,
    description: 'Iklan Instagram Ads promosi menu Juli',
    paymentMethod: 'Transfer Bank',
  },
  {
    id: 't-8',
    date: '2026-07-05',
    type: 'income',
    category: 'Penjualan Retail',
    amount: 2100000,
    description: 'Omset akhir pekan (weekend) offline ruko',
    paymentMethod: 'QRIS',
  },
  {
    id: 't-9',
    date: '2026-06-25',
    type: 'expense',
    category: 'Sewa Tempat',
    amount: 5000000,
    description: 'Cicilan sewa ruko bulanan (bulan Juni/Juli)',
    paymentMethod: 'Transfer Bank',
  },
  {
    id: 't-10',
    date: '2026-06-28',
    type: 'income',
    category: 'Penjualan Retail',
    amount: 1850000,
    description: 'Penjualan harian akhir bulan Juni',
    paymentMethod: 'QRIS',
  },
  {
    id: 't-11',
    date: '2026-06-30',
    type: 'expense',
    category: 'Gaji Karyawan',
    amount: 4500000,
    description: 'Gaji 2 barista paruh waktu bulan Juni',
    paymentMethod: 'Transfer Bank',
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV/202607/001',
    date: '2026-07-01',
    dueDate: '2026-07-15',
    customerName: 'CV Jasa Makmur Abadi',
    customerEmail: 'finance@jasamakmur.com',
    items: [
      { id: 'i-1', description: 'Paket Kopi Botol Literan (20 pcs)', quantity: 2, price: 350000 },
      { id: 'i-2', description: 'Snack Box Kue Tradisional (40 pax)', quantity: 1, price: 500000 },
    ],
    status: 'Belum Lunas',
    taxRate: 11,
    discountRate: 5,
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV/202607/002',
    date: '2026-07-03',
    dueDate: '2026-07-10',
    customerName: 'Ibu Ratih - Arisan RW',
    customerEmail: 'ratih.indri@gmail.com',
    items: [
      { id: 'i-3', description: 'Kopi Susu Gula Aren Es (50 cup)', quantity: 1, price: 900000 },
      { id: 'i-4', description: 'Camilan Kentang & Cireng Platter', quantity: 10, price: 35000 },
    ],
    status: 'Lunas',
    taxRate: 0,
    discountRate: 0,
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV/202606/015',
    date: '2026-06-20',
    dueDate: '2026-07-04',
    customerName: 'Universitas Maju Bersama',
    customerEmail: 'event@majubersama.ac.id',
    items: [
      { id: 'i-5', description: 'Booth Kopi Pop-up Event Wisuda (3 hari)', quantity: 1, price: 3000000 },
    ],
    status: 'Jatuh Tempo',
    taxRate: 11,
    discountRate: 10,
  }
];

export const INDONESIAN_EXPENSE_CATEGORIES = [
  'Bahan Baku',
  'Operasional',
  'Gaji Karyawan',
  'Utilitas & Listrik',
  'Sewa Tempat',
  'Pemasaran & Iklan',
  'Transportasi / Kurir',
  'Peralatan Baru',
  'Lain-lain'
];

export const INDONESIAN_INCOME_CATEGORIES = [
  'Penjualan Retail',
  'Penjualan Online',
  'Penjualan Event / Catering',
  'Modal Sendiri',
  'Pinjaman / Pendanaan',
  'Pendapatan Lain-lain'
];
