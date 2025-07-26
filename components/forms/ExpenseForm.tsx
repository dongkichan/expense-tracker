'use client';

import React, { useState, FormEvent } from 'react';
import { Expense, ExpenseFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { DollarSign, Tag, Calendar, FileText, Sparkles, Save, X } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  initialData?: Expense;
  onCancel?: () => void;
}

const CATEGORIES: Expense['category'][] = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];

const CATEGORY_ICONS = {
  Food: '🍽️',
  Transportation: '🚗',
  Entertainment: '🎬',
  Utilities: '💡',
  Healthcare: '🏥',
  Other: '📦',
};

const CATEGORY_GRADIENTS = {
  Food: 'from-emerald-400 to-emerald-600',
  Transportation: 'from-blue-400 to-blue-600',
  Entertainment: 'from-purple-400 to-purple-600',
  Utilities: 'from-amber-400 to-amber-600',
  Healthcare: 'from-red-400 to-red-600',
  Other: 'from-gray-400 to-gray-600',
};

export function ExpenseForm({ onSubmit, initialData, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount.toString() || '',
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description.trim(),
      date: formData.date,
    });

    if (!initialData) {
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
      setErrors({});
    }
  };

  const handleChange = (field: keyof ExpenseFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const FloatingInput = ({ 
    label, 
    value, 
    onChange, 
    type = 'text', 
    icon: Icon, 
    error, 
    field,
    step,
    placeholder
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    icon: React.ElementType;
    error?: string;
    field: string;
    step?: string;
    placeholder?: string;
  }) => (
    <div className="relative group">
      <div className="relative">
        <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
          focusedField === field || value ? 'text-blue-400' : 'text-white/50'
        }`} />
        <input
          type={type}
          step={step}
          value={value}
          onChange={onChange}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-4 glass-card text-white placeholder-transparent
                     focus:bg-white/20 focus:border-white/40 focus:outline-none 
                     focus:ring-4 focus:ring-blue-500/30 transition-all duration-300
                     ${error ? 'border-red-400 focus:ring-red-500/30' : ''}`}
        />
        <label className={`absolute left-12 transition-all duration-300 pointer-events-none
                          ${focusedField === field || value 
                            ? 'top-2 text-xs text-blue-400 font-medium' 
                            : 'top-1/2 -translate-y-1/2 text-white/60'}`}>
          {label}
        </label>
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-sm slide-up">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          {error}
        </div>
      )}
    </div>
  );

  const FloatingTextarea = ({ 
    label, 
    value, 
    onChange, 
    icon: Icon, 
    error, 
    field 
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    icon: React.ElementType;
    error?: string;
    field: string;
  }) => (
    <div className="relative group">
      <div className="relative">
        <Icon className={`absolute left-4 top-6 h-5 w-5 transition-colors duration-300 ${
          focusedField === field || value ? 'text-blue-400' : 'text-white/50'
        }`} />
        <textarea
          value={value}
          onChange={onChange}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          rows={4}
          className={`w-full pl-12 pr-4 py-4 glass-card text-white placeholder-transparent resize-none
                     focus:bg-white/20 focus:border-white/40 focus:outline-none 
                     focus:ring-4 focus:ring-blue-500/30 transition-all duration-300
                     ${error ? 'border-red-400 focus:ring-red-500/30' : ''}`}
        />
        <label className={`absolute left-12 transition-all duration-300 pointer-events-none
                          ${focusedField === field || value 
                            ? 'top-2 text-xs text-blue-400 font-medium' 
                            : 'top-6 text-white/60'}`}>
          {label}
        </label>
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-sm slide-up">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          {error}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 fade-in">
        <div className="inline-flex items-center gap-3 glass-card px-6 py-3 mb-6">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <span className="gradient-text font-semibold">
            {initialData ? 'Edit Expense' : 'New Expense'}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-white text-shadow mb-2">
          {initialData ? 'Update Your Expense' : 'Add New Expense'}
        </h2>
        <p className="text-white/70">
          {initialData ? 'Make changes to your expense details' : 'Track your spending with beautiful simplicity'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8 slide-up">
        {/* Amount */}
        <FloatingInput
          label="Amount"
          value={formData.amount}
          onChange={handleChange('amount')}
          type="number"
          step="0.01"
          icon={DollarSign}
          error={errors.amount}
          field="amount"
          placeholder="0.00"
        />

        {/* Category Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="h-5 w-5 text-blue-400" />
            <label className="text-white font-medium">Category</label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category }))}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 ${
                  formData.category === category
                    ? `bg-gradient-to-r ${CATEGORY_GRADIENTS[category]} border-white/50 shadow-xl scale-105`
                    : 'glass-card border-white/20 hover:border-white/40'
                }`}
              >
                <div className="text-2xl mb-2">{CATEGORY_ICONS[category]}</div>
                <div className="text-white font-medium text-sm">{category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <FloatingTextarea
          label="Description"
          value={formData.description}
          onChange={handleChange('description')}
          icon={FileText}
          error={errors.description}
          field="description"
        />

        {/* Date */}
        <FloatingInput
          label="Date"
          value={formData.date}
          onChange={handleChange('date')}
          type="date"
          icon={Calendar}
          error={errors.date}
          field="date"
        />

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button 
            type="submit" 
            variant="gradient" 
            size="lg" 
            glow
            className="flex-1"
          >
            <Save className="h-5 w-5" />
            {initialData ? 'Update Expense' : 'Save Expense'}
          </Button>
          
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              size="lg"
              onClick={onCancel}
            >
              <X className="h-5 w-5" />
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}