/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  paymentMethod: 'Tunai' | 'Transfer Bank' | 'E-Wallet' | 'QRIS';
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerEmail?: string;
  items: InvoiceItem[];
  status: 'Lunas' | 'Belum Lunas' | 'Jatuh Tempo';
  taxRate: number; // in percentage, e.g. 11
  discountRate: number; // in percentage, e.g. 5
}

export interface BusinessProfile {
  name: string;
  industry: 'Kuliner (F&B)' | 'Ritel / Toko Klontong' | 'Jasa / Servis' | 'Kerajinan / Kriya' | 'Fashion & Pakaian' | 'Lainnya';
  currency: 'IDR';
  monthlyBudget: number;
  ownerName: string;
}

export type ActiveTab = 'dashboard' | 'transactions' | 'invoices' | 'reports' | 'ai-advisor' | 'settings';
