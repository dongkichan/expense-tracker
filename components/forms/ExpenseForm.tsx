'use client';

import React, { useState, FormEvent } from 'react';
import { Expense, ExpenseFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  initialData?: Expense;
  onCancel?: () => void;
}

const CATEGORIES: Expense['category'][] = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];

export function ExpenseForm({ onSubmit, initialData, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount.toString() || '',
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
        <CardDescription>
          {initialData ? 'Update the expense details below' : 'Fill in the details to track a new expense'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange('amount')}
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
            />
            {errors.amount && (
              <p id="amount-error" className="text-sm text-destructive">
                {errors.amount}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={formData.category}
              onChange={handleChange('category')}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter expense description"
              value={formData.description}
              onChange={handleChange('description')}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={handleChange('date')}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? 'date-error' : undefined}
            />
            {errors.date && (
              <p id="date-error" className="text-sm text-destructive">
                {errors.date}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {initialData ? 'Update Expense' : 'Add Expense'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}