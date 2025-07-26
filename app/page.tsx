'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { Dashboard } from '@/components/charts/Dashboard';
import { Expense } from '@/lib/types';
import { StorageService } from '@/lib/storage';

export default function Home() {
  const [activeView, setActiveView] = useState<'dashboard' | 'add' | 'list'>('dashboard');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    expenses,
    loading,
    filters,
    setFilters,
    addExpense,
    updateExpense,
    deleteExpense,
    dashboardStats,
    totalAmount,
  } = useExpenses();

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const success = addExpense(expense);
    if (success) {
      setActiveView('dashboard');
    }
  };

  const handleUpdateExpense = (expense: Omit<Expense, 'id'>) => {
    if (!editingExpense) return;

    const success = updateExpense(editingExpense.id, expense);
    if (success) {
      setEditingExpense(null);
      setActiveView('list');
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setActiveView('add');
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setActiveView('dashboard');
  };

  const handleImport = (importedExpenses: Expense[]) => {
    const existingExpenses = StorageService.getExpenses();
    const allExpenses = [...existingExpenses, ...importedExpenses];
    const success = StorageService.saveExpenses(allExpenses);
    
    if (success) {
      window.location.reload();
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewChange = (view: 'dashboard' | 'add' | 'list') => {
    setActiveView(view);
    setSidebarOpen(false);
    if (view !== 'add') {
      setEditingExpense(null);
    }
  };

  const handleQuickAdd = () => {
    setEditingExpense(null);
    setActiveView('add');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-8 glass-card rounded-full flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-white text-shadow mb-2">Loading ExpenseFlow</h2>
          <p className="text-white/60">Preparing your beautiful expense tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <Header 
        expenses={expenses} 
        onImport={handleImport}
        onMenuClick={toggleSidebar}
        showMenuButton={true}
        onAddExpense={activeView !== 'add' ? handleQuickAdd : undefined}
      />

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full glass-card border-r border-white/10 pt-24 lg:pt-6">
            <div className="px-6 py-8">
              <Navigation 
                activeView={activeView} 
                onViewChange={handleViewChange}
                className="space-y-3"
              />
              
              {/* Sidebar Footer */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="glass-card p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Beautiful Tracking</h3>
                  <p className="text-white/60 text-sm">Manage your expenses with style and elegance</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="min-h-screen px-6 lg:px-12 py-8">
            <div className="mx-auto max-w-7xl">
              {/* Dashboard */}
              {activeView === 'dashboard' && (
                <div className="fade-in">
                  <Dashboard stats={dashboardStats} />
                </div>
              )}

              {/* Add/Edit Expense Form */}
              {activeView === 'add' && (
                <div className="fade-in">
                  <ExpenseForm
                    onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
                    initialData={editingExpense || undefined}
                    onCancel={editingExpense ? handleCancelEdit : undefined}
                  />
                </div>
              )}

              {/* Expense List */}
              {activeView === 'list' && (
                <div className="fade-in">
                  <div className="mb-8 text-center">
                    <h2 className="text-4xl font-bold text-white text-shadow mb-4">
                      All Expenses
                    </h2>
                    <p className="text-xl text-white/70">
                      Manage and organize your spending history
                    </p>
                  </div>
                  
                  <ExpenseList
                    expenses={expenses}
                    onEdit={handleEdit}
                    onDelete={deleteExpense}
                    filters={filters}
                    onFiltersChange={setFilters}
                    totalAmount={totalAmount}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}