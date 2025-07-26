'use client';

import React from 'react';
import { DashboardStats, CategoryTotal } from '@/lib/types';
import { DollarSign, TrendingUp, ShoppingCart, Calendar, Sparkles, ArrowUp, Zap } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { format } from 'date-fns';

interface DashboardProps {
  stats: DashboardStats;
}

const COLORS = {
  Food: '#10b981',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#f59e0b',
  Bills: '#ef4444',
  Other: '#6b7280',
};

const GRADIENT_COLORS = {
  Food: 'from-emerald-400 to-emerald-600',
  Transportation: 'from-blue-400 to-blue-600',
  Entertainment: 'from-purple-400 to-purple-600',
  Shopping: 'from-amber-400 to-amber-600',
  Bills: 'from-red-400 to-red-600',
  Other: 'from-gray-400 to-gray-600',
};

export function Dashboard({ stats }: DashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const pieChartData = stats.categoryBreakdown.map(item => ({
    name: item.category,
    value: item.total,
    color: COLORS[item.category as keyof typeof COLORS],
  }));

  const barChartData = stats.categoryBreakdown.map(item => ({
    category: item.category,
    amount: item.total,
    count: item.count,
  }));

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    gradient, 
    delay = 0,
    trend,
    showTrend = false
  }: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ElementType;
    gradient: string;
    delay?: number;
    trend?: 'up' | 'down' | 'neutral';
    showTrend?: boolean;
  }) => (
    <div className={`glass-card-hover p-8 slide-up floating-animation`} 
         style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-2xl bg-gradient-to-r ${gradient} shadow-glow`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        {trend === 'up' && showTrend && (
          <div className="flex items-center text-emerald-400 text-sm font-medium">
            <ArrowUp className="h-4 w-4 mr-1" />
            +12%
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-white/70 text-sm font-medium tracking-wide uppercase">{title}</h3>
        <p className="text-4xl font-bold text-white text-shadow">{value}</p>
        <p className="text-white/60 text-sm">{subtitle}</p>
      </div>
      
      <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${gradient} rounded-full`} 
             style={{ width: '70%', animation: 'expand 2s ease-out' }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 glass-card px-8 py-4 mb-6">
          <Sparkles className="h-6 w-6 text-yellow-400 pulse-glow" />
          <span className="gradient-text text-xl font-semibold">Financial Overview</span>
        </div>
        <h1 className="text-5xl font-bold text-white text-shadow mb-4">
          Your Expense Dashboard
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Beautiful insights into your spending patterns with real-time analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          subtitle="All time spending"
          icon={DollarSign}
          gradient="from-blue-500 to-purple-600"
          delay={0}
          trend="up"
          showTrend={stats.totalExpenses > 0}
        />
        
        <StatCard
          title="This Month"
          value={formatCurrency(stats.monthlyAverage)}
          subtitle="Current month spending"
          icon={Calendar}
          gradient="from-emerald-500 to-teal-600"
          delay={100}
          trend="up"
          showTrend={stats.monthlyAverage > 0}
        />
        
        <StatCard
          title="Top Category"
          value={stats.highestCategory?.category || 'N/A'}
          subtitle={stats.highestCategory ? formatCurrency(stats.highestCategory.amount) : 'No expenses yet'}
          icon={TrendingUp}
          gradient="from-pink-500 to-rose-600"
          delay={200}
          trend="neutral"
        />
        
        <StatCard
          title="Total Items"
          value={stats.categoryBreakdown.reduce((sum, cat) => sum + cat.count, 0).toString()}
          subtitle="Expense entries"
          icon={ShoppingCart}
          gradient="from-amber-500 to-orange-600"
          delay={300}
          trend="up"
          showTrend={stats.categoryBreakdown.reduce((sum, cat) => sum + cat.count, 0) > 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Category Breakdown Bar Chart */}
        <div className="glass-card p-8 slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
              <BarChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Category Breakdown</h3>
              <p className="text-white/60">Spending by category</p>
            </div>
          </div>
          
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  labelFormatter={(label) => `Category: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-white/50">
              <div className="text-center">
                <Zap className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No data to display</p>
              </div>
            </div>
          )}
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="glass-card p-8 slide-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Distribution</h3>
              <p className="text-white/60">Percentage breakdown</p>
            </div>
          </div>
          
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="rgba(255,255,255,0.2)"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-white/50">
              <div className="text-center">
                <Zap className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No data to display</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="glass-card p-8 slide-up" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
            <p className="text-white/60">Your latest transactions</p>
          </div>
        </div>
        
        {stats.recentExpenses.length > 0 ? (
          <div className="space-y-4">
            {stats.recentExpenses.map((expense, index) => (
              <div 
                key={expense.id} 
                className="glass-card-hover p-6 flex items-center justify-between"
                style={{ animationDelay: `${700 + index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${
                    GRADIENT_COLORS[expense.category as keyof typeof GRADIENT_COLORS]
                  } flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-sm">
                      {expense.category.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{expense.description}</p>
                    <div className="flex items-center gap-3 text-sm text-white/60">
                      <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${
                        GRADIENT_COLORS[expense.category as keyof typeof GRADIENT_COLORS]
                      } text-white font-medium`}>
                        {expense.category}
                      </span>
                      <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-white text-shadow">
                  {formatCurrency(expense.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/50">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center">
              <Calendar className="h-12 w-12 opacity-50" />
            </div>
            <p className="text-xl">No recent expenses</p>
            <p className="text-sm mt-2">Start tracking to see your activity here</p>
          </div>
        )}
      </div>
    </div>
  );
}