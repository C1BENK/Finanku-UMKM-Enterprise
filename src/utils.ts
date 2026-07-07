/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, Invoice } from './types';

// Helper to format currency in Indonesian Rupiah
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Calculate totals from transactions
export function calculateTotals(transactions: Transaction[]) {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }
  });

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
}

// Calculate values for invoice total
export function calculateInvoiceTotals(invoice: Invoice) {
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const discountAmount = subtotal * (invoice.discountRate / 100);
  const taxedAmount = (subtotal - discountAmount) * (invoice.taxRate / 100);
  const total = subtotal - discountAmount + taxedAmount;

  return {
    subtotal,
    discountAmount,
    taxedAmount,
    total,
  };
}

// Generate unique ID
export function generateId(prefix: string = ''): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
