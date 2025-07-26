'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Menu, Sparkles, FileDown, FileUp, Plus } from 'lucide-react';
import { exportToCSV, parseCSV } from '@/lib/utils';
import { Expense } from '@/lib/types';

interface HeaderProps {
  expenses: Expense[];
  onImport: (expenses: Expense[]) => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  onAddExpense?: () => void;
}

export function Header({ expenses, onImport, onMenuClick, showMenuButton = false, onAddExpense }: HeaderProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    if (expenses.length === 0) {
      // Show elegant notification instead of alert
      return;
    }
    
    setIsExporting(true);
    
    // Add a small delay for elegant loading animation
    setTimeout(() => {
      exportToCSV(expenses);
      setIsExporting(false);
    }, 800);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        const parsedExpenses = parseCSV(csvText);
        
        setTimeout(() => {
          if (parsedExpenses && parsedExpenses.length > 0) {
            onImport(parsedExpenses);
          }
          setIsImporting(false);
        }, 800);
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full glass-card border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              {showMenuButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={onMenuClick}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              )}
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white text-shadow">ExpenseFlow</h1>
                  <p className="text-sm text-white/60">Beautiful expense tracking</p>
                </div>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleImport}
                disabled={isImporting}
                className="hidden sm:inline-flex"
              >
                {isImporting ? (
                  <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full" />
                ) : (
                  <FileUp className="h-4 w-4" />
                )}
                <span className="ml-2">Import</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                disabled={expenses.length === 0 || isExporting}
                className="hidden sm:inline-flex"
              >
                {isExporting ? (
                  <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                <span className="ml-2">Export</span>
              </Button>

              {/* Mobile Action Buttons */}
              <div className="flex items-center gap-2 sm:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleImport}
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExport}
                  disabled={expenses.length === 0 || isExporting}
                >
                  {isExporting ? (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Action Button */}
      {onAddExpense && (
        <Button
          variant="floating"
          onClick={onAddExpense}
          className="group"
          title="Add New Expense"
        >
          <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      )}

      {/* Notification Toast (for future implementation) */}
      <div className="fixed top-24 right-6 z-50 space-y-2">
        {/* Success notification */}
        {isExporting && (
          <div className="glass-card px-6 py-4 slide-up">
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full" />
              <span className="text-white font-medium">Exporting expenses...</span>
            </div>
          </div>
        )}
        
        {isImporting && (
          <div className="glass-card px-6 py-4 slide-up">
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full" />
              <span className="text-white font-medium">Importing expenses...</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}