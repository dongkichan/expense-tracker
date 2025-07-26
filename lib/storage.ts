import { Expense } from './types';

const STORAGE_KEY = 'expenses';

export class StorageService {
  static getExpenses(): Expense[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  static saveExpenses(expenses: Expense[]): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please delete some old expenses.');
      }
      return false;
    }
  }

  static addExpense(expense: Expense): boolean {
    const expenses = this.getExpenses();
    expenses.push(expense);
    return this.saveExpenses(expenses);
  }

  static updateExpense(id: string, updatedExpense: Partial<Expense>): boolean {
    const expenses = this.getExpenses();
    const index = expenses.findIndex(expense => expense.id === id);
    
    if (index === -1) return false;
    
    expenses[index] = { ...expenses[index], ...updatedExpense };
    return this.saveExpenses(expenses);
  }

  static deleteExpense(id: string): boolean {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    
    if (filteredExpenses.length === expenses.length) return false;
    
    return this.saveExpenses(filteredExpenses);
  }

  static clearAllExpenses(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  static exportData(): string {
    const expenses = this.getExpenses();
    return JSON.stringify(expenses, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const expenses = JSON.parse(jsonData) as Expense[];
      
      if (!Array.isArray(expenses)) {
        throw new Error('Invalid data format');
      }
      
      const isValid = expenses.every(expense => 
        expense.id && 
        typeof expense.amount === 'number' &&
        expense.category &&
        expense.description &&
        expense.date
      );
      
      if (!isValid) {
        throw new Error('Invalid expense data');
      }
      
      return this.saveExpenses(expenses);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}