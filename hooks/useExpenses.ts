import { useState, useEffect, useCallback, useMemo } from 'react';
import { Expense, ExpenseFilters, CategoryTotal, DashboardStats } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ExpenseFilters>({});

  useEffect(() => {
    const loadExpenses = () => {
      setLoading(true);
      const data = StorageService.getExpenses();
      setExpenses(data);
      setLoading(false);
    };

    loadExpenses();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'expenses') {
        loadExpenses();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };

    const success = StorageService.addExpense(newExpense);
    if (success) {
      setExpenses(prev => [...prev, newExpense]);
    }
    return success;
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    const success = StorageService.updateExpense(id, updates);
    if (success) {
      setExpenses(prev => 
        prev.map(expense => expense.id === id ? { ...expense, ...updates } : expense)
      );
    }
    return success;
  }, []);

  const deleteExpense = useCallback((id: string) => {
    const success = StorageService.deleteExpense(id);
    if (success) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    }
    return success;
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      if (filters.category && expense.category !== filters.category) {
        return false;
      }

      if (filters.dateRange) {
        const expenseDate = parseISO(expense.date);
        const start = parseISO(filters.dateRange.startDate);
        const end = parseISO(filters.dateRange.endDate);
        
        if (!isWithinInterval(expenseDate, { start, end })) {
          return false;
        }
      }

      if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        return expense.description.toLowerCase().includes(search) ||
               expense.category.toLowerCase().includes(search);
      }

      return true;
    });
  }, [expenses, filters]);

  const categoryTotals = useMemo((): CategoryTotal[] => {
    const totals = filteredExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { category: expense.category, total: 0, count: 0 };
      }
      acc[expense.category].total += expense.amount;
      acc[expense.category].count += 1;
      return acc;
    }, {} as Record<string, CategoryTotal>);

    return Object.values(totals).sort((a, b) => b.total - a.total);
  }, [filteredExpenses]);

  const dashboardStats = useMemo((): DashboardStats => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const now = new Date();
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, {
        start: startOfMonth(now),
        end: endOfMonth(now),
      });
    });

    const monthlyTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const allCategoryTotals = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { category: expense.category, total: 0, count: 0 };
      }
      acc[expense.category].total += expense.amount;
      acc[expense.category].count += 1;
      return acc;
    }, {} as Record<string, CategoryTotal>);

    const categoryBreakdown = Object.values(allCategoryTotals).sort((a, b) => b.total - a.total);
    const highestCategory = categoryBreakdown[0] || null;

    const recentExpenses = [...expenses]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);

    return {
      totalExpenses,
      monthlyAverage: monthlyTotal,
      highestCategory: highestCategory ? {
        category: highestCategory.category,
        amount: highestCategory.total,
      } : null,
      recentExpenses,
      categoryBreakdown,
    };
  }, [expenses]);

  return {
    expenses: filteredExpenses,
    loading,
    filters,
    setFilters,
    addExpense,
    updateExpense,
    deleteExpense,
    categoryTotals,
    dashboardStats,
    totalExpenses: expenses.length,
    totalAmount: filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
  };
}