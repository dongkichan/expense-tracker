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
      setActiveView('list');
    } else {
      alert('Failed to add expense. Please try again.');
    }
  };

  const handleUpdateExpense = (expense: Omit<Expense, 'id'>) => {
    if (!editingExpense) return;

    const success = updateExpense(editingExpense.id, expense);
    if (success) {
      setEditingExpense(null);
      setActiveView('list');
    } else {
      alert('Failed to update expense. Please try again.');
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setActiveView('add');
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleImport = (importedExpenses: Expense[]) => {
    const existingExpenses = StorageService.getExpenses();
    const allExpenses = [...existingExpenses, ...importedExpenses];
    const success = StorageService.saveExpenses(allExpenses);
    
    if (success) {
      window.location.reload();
    } else {
      alert('Failed to import expenses. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewChange = (view: 'dashboard' | 'add' | 'list') => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        expenses={expenses} 
        onImport={handleImport}
        onMenuClick={toggleSidebar}
        showMenuButton={true}
      />

      <div className="flex">
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full px-4 py-6">
            <Navigation 
              activeView={activeView} 
              onViewChange={handleViewChange}
            />
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {activeView === 'dashboard' && (
              <Dashboard stats={dashboardStats} />
            )}

            {activeView === 'add' && (
              <div className="max-w-2xl mx-auto">
                <ExpenseForm
                  onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
                  initialData={editingExpense || undefined}
                  onCancel={editingExpense ? handleCancelEdit : undefined}
                />
              </div>
            )}

            {activeView === 'list' && (
              <ExpenseList
                expenses={expenses}
                onEdit={handleEdit}
                onDelete={deleteExpense}
                filters={filters}
                onFiltersChange={setFilters}
                totalAmount={totalAmount}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}