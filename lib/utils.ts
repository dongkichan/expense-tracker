import { Expense } from './types';
import { format } from 'date-fns';

export function exportToCSV(expenses: Expense[]): void {
  const headers = ['Date', 'Amount', 'Category', 'Description'];
  
  const rows = expenses.map(expense => [
    format(new Date(expense.date), 'yyyy-MM-dd'),
    expense.amount.toFixed(2),
    expense.category,
    `"${expense.description.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSV(csvText: string): Expense[] | null {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return null;

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const dateIndex = headers.findIndex(h => h === 'date');
    const amountIndex = headers.findIndex(h => h === 'amount');
    const categoryIndex = headers.findIndex(h => h === 'category');
    const descriptionIndex = headers.findIndex(h => h === 'description');

    if (dateIndex === -1 || amountIndex === -1 || categoryIndex === -1 || descriptionIndex === -1) {
      return null;
    }

    const expenses: Expense[] = [];
    const validCategories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      
      const date = values[dateIndex];
      const amount = parseFloat(values[amountIndex]);
      const category = values[categoryIndex];
      const description = values[descriptionIndex];

      if (!date || isNaN(amount) || !validCategories.includes(category) || !description) {
        continue;
      }

      expenses.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        date,
        amount,
        category: category as Expense['category'],
        description,
      });
    }

    return expenses;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return null;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string): string {
  return format(new Date(date), 'PPP');
}