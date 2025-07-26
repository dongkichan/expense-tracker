'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Menu } from 'lucide-react';
import { exportToCSV, parseCSV } from '@/lib/utils';
import { Expense } from '@/lib/types';

interface HeaderProps {
  expenses: Expense[];
  onImport: (expenses: Expense[]) => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ expenses, onImport, onMenuClick, showMenuButton = false }: HeaderProps) {
  const handleExport = () => {
    if (expenses.length === 0) {
      alert('No expenses to export');
      return;
    }
    exportToCSV(expenses);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        const parsedExpenses = parseCSV(csvText);
        
        if (parsedExpenses && parsedExpenses.length > 0) {
          onImport(parsedExpenses);
          alert(`Successfully imported ${parsedExpenses.length} expenses`);
        } else {
          alert('Failed to parse CSV file. Please check the file format.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            title="Import expenses from CSV"
          >
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={expenses.length === 0}
            title="Export expenses to CSV"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
}