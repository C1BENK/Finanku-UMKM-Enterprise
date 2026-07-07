/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  FileText, 
  Sparkles, 
  Settings, 
  ChevronRight, 
  LogOut,
  Calendar,
  Layers,
  Menu,
  X,
  User,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, Invoice, BusinessProfile, ActiveTab } from './types';
import { 
  INITIAL_PROFILE, 
  INITIAL_TRANSACTIONS, 
  INITIAL_INVOICES 
} from './mockData';
import { formatRupiah, calculateTotals } from './utils';

// Import subcomponents
import Login from './components/Login';
import DashboardOverview from './components/DashboardOverview';
import TransactionList from './components/TransactionList';
import InvoiceGenerator from './components/InvoiceGenerator';
import FinancialReports from './components/FinancialReports';
import AIAssistant from './components/AIAssistant';
import ProfileSettings from './components/ProfileSettings';

export default function App() {
  // Authentication & Multi-role states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('umkm_auth_state') === 'true';
  });
  const [userRole, setUserRole] = useState<'owner' | 'staff'>(() => {
    return (localStorage.getItem('umkm_user_role') as 'owner' | 'staff') || 'owner';
  });
  const [activeUserName, setActiveUserName] = useState<string>(() => {
    return localStorage.getItem('umkm_user_name') || 'Budi Santoso';
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core App Database States (Seeded from localStorage or Mock data)
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('umkm_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('umkm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('umkm_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  // Persist states to localStorage when updated
  useEffect(() => {
    localStorage.setItem('umkm_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('umkm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('umkm_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Calculations for upper summary ribbon
  const totals = calculateTotals(transactions);

  // Core Actions
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleEditTransaction = (editedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === editedTx.id ? editedTx : t));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddInvoice = (newInv: Invoice) => {
    setInvoices(prev => [newInv, ...prev]);
  };

  const handleUpdateInvoiceStatus = (id: string, status: 'Lunas' | 'Belum Lunas' | 'Jatuh Tempo') => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const handleUpdateProfile = (newProfile: BusinessProfile) => {
    setProfile(newProfile);
  };

  const handleLogin = (role: 'owner' | 'staff', name: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setActiveUserName(name);
    localStorage.setItem('umkm_auth_state', 'true');
    localStorage.setItem('umkm_user_role', role);
    localStorage.setItem('umkm_user_name', name);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('umkm_auth_state');
    localStorage.removeItem('umkm_user_role');
    localStorage.removeItem('umkm_user_name');
  };

  // Nav items configuration dynamically filtered by role
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'transactions', label: 'Pencatatan Kas', icon: Receipt },
    { id: 'invoices', label: 'Faktur & Invoice', icon: FileText },
    ...(userRole === 'owner' ? [
      { id: 'reports', label: 'Laba Rugi Bulanan', icon: Layers },
      { id: 'ai-advisor', label: 'Asisten AI Keuangan', icon: Sparkles, isAi: true },
      { id: 'settings', label: 'Pengaturan Profil', icon: Settings },
    ] : [])
  ];

  // Render Login page if not logged in
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div id="app-root" className="min-h-screen flex bg-slate-50 text-slate-800">
      
      {/* 1. SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 text-slate-300 border-r border-slate-850 shrink-0 h-screen sticky top-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/35">
            <span className="font-heading text-lg font-black tracking-wider">F</span>
          </div>
          <div>
            <h2 className="text-sm font-heading font-extrabold text-slate-100 tracking-tight">Finanku Enterprise</h2>
            <p className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Sistem Keuangan Digital</p>
          </div>
        </div>

        {/* User Role Card */}
        <div className="px-5 py-4 mx-4 my-3 bg-slate-800/30 border border-slate-800/80 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <User className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Pengguna Aktif</p>
              <h4 className="text-xs font-bold text-slate-200 truncate">{activeUserName}</h4>
              <p className="text-[9px] text-indigo-400 font-semibold tracking-wide uppercase mt-0.5">
                {userRole === 'owner' ? 'Owner Usaha' : 'Staff / Barista'}
              </p>
            </div>
          </div>
        </div>

        {/* Business quick info card */}
        <div className="p-4 mx-4 mb-4 bg-slate-850/40 border border-slate-850/60 rounded-2xl">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Identitas Usaha</p>
          <h4 className="text-xs font-bold text-slate-200 truncate">{profile.name}</h4>
          <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">{profile.industry}</p>
          
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Total Kas:</span>
            <span className="font-bold text-white">{formatRupiah(totals.netBalance)}</span>
          </div>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as ActiveTab);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-4.5 w-4.5 ${
                    isActive ? 'text-white' : item.isAi ? 'text-indigo-400 group-hover:text-indigo-300' : 'text-slate-500 group-hover:text-slate-400'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.isAi && !isActive && (
                  <span className="px-1.5 py-0.2 bg-indigo-500/10 border border-indigo-400/20 text-[9px] font-bold text-indigo-300 rounded">
                    PRO
                  </span>
                )}
                {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Log out */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-rose-950/20 hover:text-rose-400 border border-slate-700/80 hover:border-rose-900/40 rounded-xl text-xs font-semibold text-slate-300 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Sistem
          </button>
          <div className="mt-4 text-[9px] text-slate-500 text-center leading-normal">
            <p className="font-bold text-slate-400">Finanku Enterprise v2.4</p>
            <p>Sistem Akuntansi Enkripsi Militer</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Upper Global Header/Ribbon */}
        <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button 
              id="mobile-menu-trigger-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Title / Tab Name */}
            <h1 className="text-sm sm:text-base font-heading font-extrabold text-slate-950 uppercase tracking-wide">
              {navItems.find(i => i.id === activeTab)?.label || 'Dashboard Utama'}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Quick mini state pill */}
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-slate-400 font-normal">|</span>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Kas Aktif: <strong className="text-slate-900">{formatRupiah(totals.netBalance)}</strong></span>
              </div>
              <span className="text-slate-400 font-normal">|</span>
              <div className="flex items-center gap-1 text-slate-500">
                <Calendar className="h-4 w-4" />
                <span>Sen, 06 Juli 2026</span>
              </div>
            </div>

            {/* Premium Client Status Badge */}
            <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Sistem Online
            </div>
          </div>
        </header>

        {/* 3. SCENE CONTAINER WITH TRANSITION EFFECT */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardOverview 
                  transactions={transactions} 
                  profile={profile}
                  onNavigate={(tab) => setActiveTab(tab)}
                />
              )}
              {activeTab === 'transactions' && (
                <TransactionList 
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                  onEditTransaction={handleEditTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              )}
              {activeTab === 'invoices' && (
                <InvoiceGenerator 
                  invoices={invoices}
                  onAddInvoice={handleAddInvoice}
                  onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
                  onDeleteInvoice={handleDeleteInvoice}
                  businessName={profile.name}
                />
              )}
              {activeTab === 'reports' && userRole === 'owner' && (
                <FinancialReports 
                  transactions={transactions}
                  profile={profile}
                />
              )}
              {activeTab === 'ai-advisor' && userRole === 'owner' && (
                <AIAssistant 
                  transactions={transactions}
                  profile={profile}
                />
              )}
              {activeTab === 'settings' && userRole === 'owner' && (
                <ProfileSettings 
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 4. MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />

            {/* Slide-out drawer menu */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-300 z-50 p-6 flex flex-col justify-between lg:hidden shadow-2xl border-r border-slate-850"
            >
              <div className="space-y-6">
                {/* Brand and close button */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                      <span className="font-heading">F</span>
                    </div>
                    <div>
                      <h2 className="text-xs font-heading font-extrabold text-slate-100 tracking-tight">Finanku Enterprise</h2>
                      <p className="text-[9px] text-indigo-400 font-bold uppercase">Sistem Keuangan</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* User Role Card inside Mobile Menu */}
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl space-y-1">
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Pengguna Aktif</p>
                  <h4 className="text-xs font-bold text-slate-200 truncate">{activeUserName}</h4>
                  <p className="text-[8px] text-indigo-400 font-semibold uppercase">{userRole === 'owner' ? 'Owner Usaha' : 'Staff / Barista'}</p>
                </div>

                {/* Profil info */}
                <div className="p-4 bg-slate-800/40 border border-slate-850 rounded-xl space-y-1">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Brand Usaha</p>
                  <h4 className="text-xs font-bold text-slate-200 truncate">{profile.name}</h4>
                  <p className="text-[9px] text-indigo-400 font-semibold">{profile.industry}</p>
                </div>

                {/* Nav Items */}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as ActiveTab);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive 
                            ? 'bg-indigo-600 text-white' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-4.5 w-4.5" />
                          <span>{item.label}</span>
                        </div>
                        {item.isAi && !isActive && (
                          <span className="px-1 py-0.2 bg-indigo-500/20 text-[8px] font-bold text-indigo-300 rounded">PRO</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer footer with logout */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-rose-950/20 hover:text-rose-400 border border-slate-700/80 hover:border-rose-900/40 rounded-xl text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar dari Sistem
                </button>
                <div className="text-[10px] text-slate-500 text-center">
                  <p className="font-bold text-slate-400 font-sans">Finanku Enterprise</p>
                  <p className="mt-1">Pencatatan Keuangan Mikro Terpercaya</p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
