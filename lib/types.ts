export interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Transportation' | 'Entertainment' | 'Utilities' | 'Healthcare' | 'Other';
  description: string;
  date: string;
}

export interface ExpenseFormData {
  amount: string;
  category: Expense['category'];
  description: string;
  date: string;
}

export interface CategoryTotal {
  category: Expense['category'];
  total: number;
  count: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ExpenseFilters {
  category?: Expense['category'];
  dateRange?: DateRange;
  searchTerm?: string;
}

export interface DashboardStats {
  totalExpenses: number;
  monthlyAverage: number;
  highestCategory: {
    category: Expense['category'];
    amount: number;
  } | null;
  recentExpenses: Expense[];
  categoryBreakdown: CategoryTotal[];
}