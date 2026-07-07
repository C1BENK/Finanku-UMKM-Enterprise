/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Send, 
  DollarSign, 
  User, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Invoice, InvoiceItem } from '../types';
import { formatRupiah, calculateInvoiceTotals, generateId } from '../utils';

interface InvoiceGeneratorProps {
  invoices: Invoice[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoiceStatus: (id: string, status: 'Lunas' | 'Belum Lunas' | 'Jatuh Tempo') => void;
  onDeleteInvoice: (id: string) => void;
  businessName: string;
}

export default function InvoiceGenerator({ 
  invoices, 
  onAddInvoice, 
  onUpdateInvoiceStatus, 
  onDeleteInvoice,
  businessName
}: InvoiceGeneratorProps) {
  // Navigation
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(invoices[0]?.id || null);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Invoice Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [dueDate, setDueDate] = useState('2026-07-20');
  const [taxRate, setTaxRate] = useState<number>(11); // PPN 11% default
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 'i-temp-1', description: 'Menu Kopi Susu Premium', quantity: 10, price: 20000 }
  ]);

  // New Item State
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemPrice, setNewItemPrice] = useState<number>(0);

  // Currently viewed invoice details
  const currentInvoice = useMemo(() => {
    return invoices.find(inv => inv.id === activeInvoiceId) || invoices[0];
  }, [invoices, activeInvoiceId]);

  // Show Toast helper
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Add Item to current building invoice
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemDesc.trim()) return;
    if (newItemPrice <= 0) return;

    const item: InvoiceItem = {
      id: generateId('i'),
      description: newItemDesc,
      quantity: Math.max(1, newItemQty),
      price: newItemPrice,
    };

    setItems([...items, item]);
    setNewItemDesc('');
    setNewItemQty(1);
    setNewItemPrice(0);
  };

  // Remove Item from building invoice
  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Save full Invoice
  const handleSaveInvoice = () => {
    if (!customerName.trim()) {
      alert('Nama pelanggan wajib diisi');
      return;
    }
    if (items.length === 0) {
      alert('Invoice harus memiliki minimal satu item');
      return;
    }

    const newInvoice: Invoice = {
      id: generateId('inv'),
      invoiceNumber: `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 900) + 100)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      customerName,
      customerEmail: customerEmail || undefined,
      items,
      status: 'Belum Lunas',
      taxRate,
      discountRate,
    };

    onAddInvoice(newInvoice);
    setActiveInvoiceId(newInvoice.id);
    setIsCreating(false);

    // Reset Form
    setCustomerName('');
    setCustomerEmail('');
    setItems([{ id: 'i-temp-1', description: 'Menu Kopi Susu Premium', quantity: 10, price: 20000 }]);
    showToast(`Invoice ${newInvoice.invoiceNumber} berhasil diterbitkan!`);
  };

  // PDF Download simulation
  const handleDownloadPDF = (invoice: Invoice) => {
    showToast(`📥 PDF ${invoice.invoiceNumber} berhasil diekspor! Mengunduh dokumen ke komputer Anda...`);
  };

  // WhatsApp Send simulation
  const handleSendWA = (invoice: Invoice) => {
    const message = `Halo ${invoice.customerName}, berikut kami kirimkan invoice tagihan ${invoice.invoiceNumber} sebesar ${formatRupiah(calculateInvoiceTotals(invoice).total)} dari ${businessName}. Harap melakukan pelunasan sebelum tanggal ${invoice.dueDate}. Terima kasih!`;
    const encoded = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=628123456789&text=${encoded}`;
    
    // open mockup simulation window
    window.open(waUrl, '_blank');
    showToast(`💬 Berhasil dialihkan ke WhatsApp untuk mengirim tagihan ke ${invoice.customerName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-slate-100 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-medium">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-950">Faktur & Invoice Generator</h1>
          <p className="text-xs text-slate-500">Toko / UMKM tagih pelanggan secara profesional & kelola piutang</p>
        </div>
        {!isCreating && (
          <button 
            id="create-invoice-btn"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/15 transition-all self-start sm:self-center"
          >
            <Plus className="h-4 w-4" />
            Buat Invoice Baru
          </button>
        )}
      </div>

      {isCreating ? (
        /* ================= INVOICE CREATOR SCREEN ================= */
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Form: Invoice Details Builder */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-heading font-bold text-slate-950">Desain Invoice Baru</h2>
              <button 
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs"
              >
                <X className="h-4 w-4" /> Batal
              </button>
            </div>

            {/* Step 1: Customer details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Informasi Pelanggan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inv-customer-name" className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Pembeli / Perusahaan</label>
                  <input
                    id="inv-customer-name"
                    type="text"
                    placeholder="Contoh: CV Makmur Jaya"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="inv-customer-email" className="block text-[11px] font-semibold text-slate-600 mb-1">Email Pelanggan (Opsional)</label>
                  <input
                    id="inv-customer-email"
                    type="email"
                    placeholder="Contoh: finance@makmur.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="inv-due-date" className="block text-[11px] font-semibold text-slate-600 mb-1">Jatuh Tempo Pembayaran</label>
                  <input
                    id="inv-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="inv-tax" className="block text-[11px] font-semibold text-slate-600 mb-1">Tarif Pajak (PPN %)</label>
                  <input
                    id="inv-tax"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="inv-discount" className="block text-[11px] font-semibold text-slate-600 mb-1">Diskon Penjualan (%)</label>
                  <input
                    id="inv-discount"
                    type="number"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Add Items */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Tambahkan Item Produk / Jasa</h3>
              
              <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-5">
                  <label htmlFor="item-desc" className="block text-[10px] font-semibold text-slate-500 mb-1">Deskripsi Item</label>
                  <input
                    id="item-desc"
                    type="text"
                    placeholder="Contoh: Catering Kopi Susu Es"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="item-qty" className="block text-[10px] font-semibold text-slate-500 mb-1">Qty</label>
                  <input
                    id="item-qty"
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="md:col-span-3">
                  <label htmlFor="item-price" className="block text-[10px] font-semibold text-slate-500 mb-1">Harga Satuan (Rp)</label>
                  <input
                    id="item-price"
                    type="number"
                    placeholder="0"
                    value={newItemPrice === 0 ? '' : newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors h-[34px]"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah
                  </button>
                </div>
              </form>

              {/* Items List Table */}
              <div className="border border-slate-150 rounded-xl overflow-hidden mt-3 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-4">Deskripsi Item</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Harga</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-3 text-center">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                          Belum ada item ditambahkan. Tambah minimal 1 produk di atas.
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2.5 px-4 font-medium text-slate-800">{item.description}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">{formatRupiah(item.price)}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-950">{formatRupiah(item.quantity * item.price)}</td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Form Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-150 hover:bg-slate-200 rounded-xl"
              >
                Kembali ke Daftar
              </button>
              <button
                type="button"
                onClick={handleSaveInvoice}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/15"
              >
                Simpan & Terbitkan Invoice
              </button>
            </div>
          </div>

          {/* Right Live Preview Area */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Pratinjau Live PDF Tagihan</h3>
            
            <div className="bg-white border-2 border-indigo-100 p-6 rounded-2xl shadow-inner text-xs font-sans text-slate-800 space-y-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 bg-indigo-500 text-white text-[10px] font-bold px-4 py-1 rotate-45 translate-x-4 translate-y-3 shadow">
                PRATINJAU
              </div>
              
              {/* Header Invoice */}
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase">{businessName}</h4>
                  <p className="text-[10px] text-slate-500">UMKM Binaan Keuangan Terpadu</p>
                </div>
                <div className="text-right">
                  <h3 className="text-base font-bold text-indigo-600 tracking-tight">FAKTUR TAGIHAN</h3>
                  <p className="text-[10px] text-slate-500">Nomor: INV/{new Date().getFullYear()}07/XXX</p>
                </div>
              </div>

              {/* Customer and Dates */}
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <p className="text-slate-400 font-semibold uppercase">Ditagih Kepada:</p>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{customerName || 'Klien Demo UMKM'}</p>
                  <p className="text-slate-500">{customerEmail || 'client@demo.com'}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-semibold uppercase">Tanggal Jatuh Tempo:</p>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{dueDate}</p>
                  <p className="text-slate-500">Masa pembayaran: 14 hari</p>
                </div>
              </div>

              {/* Billing Item Matrix */}
              <div className="space-y-1 text-[10px]">
                <div className="grid grid-cols-12 font-bold text-slate-500 border-b border-slate-100 pb-1">
                  <div className="col-span-6">Nama Layanan / Produk</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-4 text-right">Subtotal</div>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 py-1.5 border-b border-slate-50">
                    <div className="col-span-6 font-medium text-slate-800">{item.description}</div>
                    <div className="col-span-2 text-center text-slate-600">{item.quantity}</div>
                    <div className="col-span-4 text-right font-semibold text-slate-900">{formatRupiah(item.quantity * item.price)}</div>
                  </div>
                ))}
              </div>

              {/* Aggregated Totals Block */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3 text-[10px]">
                {/* Math variables */}
                {(() => {
                  const sub = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  const disc = sub * (discountRate / 100);
                  const taxVal = (sub - disc) * (taxRate / 100);
                  const tot = sub - disc + taxVal;
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Subtotal Belanja:</span>
                        <span className="font-medium">{formatRupiah(sub)}</span>
                      </div>
                      {discountRate > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Diskon Penjualan ({discountRate}%):</span>
                          <span>-{formatRupiah(disc)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pajak Pertambahan Nilai (PPN {taxRate}%):</span>
                        <span className="font-medium">{formatRupiah(taxVal)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-dashed border-slate-200 pt-2">
                        <span>TOTAL TAGIHAN:</span>
                        <span className="text-indigo-600">{formatRupiah(tot)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Bank Transfer info dummy */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[9px] text-slate-500 space-y-0.5">
                <p className="font-bold text-slate-700">Metode Transfer Pembayaran:</p>
                <p>Bank Central Asia (BCA) — Rek: 822-104-9213</p>
                <p>a/n: {businessName}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= INVOICE LIST SCREEN ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: List of all Invoices */}
          <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm h-[500px] flex flex-col justify-between">
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Daftar Semua Invoice</h2>
              {invoices.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <p>Tidak ada invoice diterbitkan.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {invoices.map((inv) => {
                    const isActive = inv.id === activeInvoiceId;
                    const invoiceSum = calculateInvoiceTotals(inv);
                    
                    return (
                      <button
                        key={inv.id}
                        onClick={() => setActiveInvoiceId(inv.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                          isActive 
                            ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                            : 'bg-white border-slate-150 hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">{inv.invoiceNumber}</span>
                            {inv.status === 'Lunas' ? (
                              <span className="bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0.2 rounded font-bold">Lunas</span>
                            ) : inv.status === 'Jatuh Tempo' ? (
                              <span className="bg-rose-50 text-rose-700 text-[9px] px-1.5 py-0.2 rounded font-bold">Jatuh Tempo</span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 text-[9px] px-1.5 py-0.2 rounded font-bold">Tagihan</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 truncate max-w-[130px]">{inv.customerName}</p>
                          <p className="text-[9px] text-slate-400">{inv.dueDate} (Tempo)</p>
                        </div>
                        <div className="text-right font-bold text-slate-900 text-xs">
                          {formatRupiah(invoiceSum.total)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="bg-indigo-50/50 rounded-xl p-3 text-[11px] text-indigo-900 border border-indigo-100 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tip Demo:</strong> Buat invoice baru untuk mensimulasikan piutang dagang dan lihat bagaimana status berubah ketika ditandai sebagai Lunas!
                </span>
              </div>
            </div>
          </div>

          {/* Right panel: Active Invoice detailed PDF preview & Actions */}
          <div className="lg:col-span-2 space-y-4">
            {currentInvoice ? (
              <div className="space-y-4">
                {/* Controls toolbar */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold">Ubah Status Faktur:</span>
                    <select
                      value={currentInvoice.status}
                      onChange={(e) => onUpdateInvoiceStatus(currentInvoice.id, e.target.value as any)}
                      className="px-2.5 py-1 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 text-slate-800"
                    >
                      <option value="Lunas">Lunas</option>
                      <option value="Belum Lunas">Belum Lunas</option>
                      <option value="Jatuh Tempo">Jatuh Tempo</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendWA(currentInvoice)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5" /> Kirim Tagihan (WA)
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(currentInvoice)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" /> Unduh PDF
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Apakah Anda yakin ingin menghapus invoice ini?')) {
                          onDeleteInvoice(currentInvoice.id);
                          setActiveInvoiceId(invoices.filter(i => i.id !== currentInvoice.id)[0]?.id || null);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg"
                      title="Hapus Faktur"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* PDF Graphic Preview */}
                <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-xs font-sans text-slate-800 space-y-8 relative">
                  {/* Status Banner Stamp */}
                  <div className="absolute right-8 top-8">
                    {currentInvoice.status === 'Lunas' ? (
                      <div className="border-4 border-emerald-500/60 text-emerald-500 font-black tracking-widest uppercase text-xs px-3 py-1.5 rotate-12 rounded">
                        LUNAS
                      </div>
                    ) : currentInvoice.status === 'Jatuh Tempo' ? (
                      <div className="border-4 border-rose-500/60 text-rose-500 font-black tracking-widest uppercase text-xs px-3 py-1.5 rotate-12 rounded">
                        OVERDUE
                      </div>
                    ) : (
                      <div className="border-4 border-amber-500/60 text-amber-500 font-black tracking-widest uppercase text-xs px-3 py-1.5 rotate-12 rounded">
                        TAGIHAN
                      </div>
                    )}
                  </div>

                  {/* Top segment */}
                  <div className="flex justify-between items-start gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-950 uppercase tracking-wide">{businessName}</h3>
                      <p className="text-slate-500 leading-relaxed">
                        Layanan Katering, Grosir Kopi & Pastry Nusantara<br />
                        Kec. Serpong, Tangerang Selatan, Banten<br />
                        Telp: +62 812-3456-7890
                      </p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-lg font-heading font-extrabold text-slate-900 uppercase">INVOICE</h2>
                      <p className="text-indigo-600 font-bold mt-1">{currentInvoice.invoiceNumber}</p>
                      <p className="text-slate-400 mt-0.5">Tanggal Terbit: {currentInvoice.date}</p>
                    </div>
                  </div>

                  {/* Customer Block info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Penerima Faktur:</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{currentInvoice.customerName}</h4>
                      {currentInvoice.customerEmail && (
                        <p className="text-slate-500 font-mono mt-0.5">{currentInvoice.customerEmail}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Ketentuan Pembayaran:</span>
                      <p className="font-bold text-slate-800 text-xs mt-1">Jatuh Tempo: {currentInvoice.dueDate}</p>
                      <p className="text-slate-500 mt-0.5">Metode: Bank Transfer (Net 14)</p>
                    </div>
                  </div>

                  {/* Product Matrix Table */}
                  <div className="space-y-1 pt-2">
                    <div className="grid grid-cols-12 font-bold text-slate-500 border-b border-slate-200 pb-2 text-[10px]">
                      <div className="col-span-6">Deskripsi Menu / Jasa</div>
                      <div className="col-span-2 text-center">Jumlah</div>
                      <div className="col-span-2 text-right">Harga Satuan</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {currentInvoice.items.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 py-3">
                          <div className="col-span-6 font-semibold text-slate-800">{item.description}</div>
                          <div className="col-span-2 text-center text-slate-600">{item.quantity}</div>
                          <div className="col-span-2 text-right text-slate-600">{formatRupiah(item.price)}</div>
                          <div className="col-span-2 text-right font-bold text-slate-950">{formatRupiah(item.quantity * item.price)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grand Totals math footer */}
                  {(() => {
                    const invoiceSum = calculateInvoiceTotals(currentInvoice);
                    return (
                      <div className="flex justify-end pt-4 border-t border-slate-100">
                        <div className="w-80 space-y-2 text-right">
                          <div className="flex justify-between text-slate-500">
                            <span>Subtotal Belanja:</span>
                            <span className="font-medium text-slate-800">{formatRupiah(invoiceSum.subtotal)}</span>
                          </div>
                          {currentInvoice.discountRate > 0 && (
                            <div className="flex justify-between text-emerald-600">
                              <span>Diskon Toko ({currentInvoice.discountRate}%):</span>
                              <span className="font-bold">-{formatRupiah(invoiceSum.discountAmount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-500">
                            <span>PPN ({currentInvoice.taxRate}%):</span>
                            <span className="font-medium text-slate-800">{formatRupiah(invoiceSum.taxedAmount)}</span>
                          </div>
                          <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-dashed border-slate-200 pt-3">
                            <span>Total Pembayaran:</span>
                            <span className="text-indigo-600 text-lg">{formatRupiah(invoiceSum.total)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Transfer Guide Signature box */}
                  <div className="grid grid-cols-2 gap-4 items-center pt-6 border-t border-slate-100">
                    <div className="bg-slate-50 p-4 rounded-xl text-[10px] text-slate-500 space-y-1 border border-slate-100">
                      <p className="font-bold text-slate-700">Instruksi Pembayaran Transfer:</p>
                      <p>Bank Central Asia (BCA) - Kantor Cabang Serpong</p>
                      <p>Nomor Rekening: <strong>822-104-9213</strong></p>
                      <p>Atas Nama: <strong>{businessName}</strong></p>
                    </div>
                    <div className="text-center font-semibold text-[10px] text-slate-500 flex flex-col items-center justify-end h-full">
                      <p>Hormat Kami,</p>
                      <div className="h-10"></div>
                      <p className="font-bold text-slate-800 underline">{businessName}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-400">
                <FileText className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p>Silakan buat atau pilih invoice untuk melihat pratinjau di sini</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
