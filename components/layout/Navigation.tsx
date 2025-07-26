'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Plus, List, BarChart3 } from 'lucide-react';

interface NavigationProps {
  activeView: 'dashboard' | 'add' | 'list';
  onViewChange: (view: 'dashboard' | 'add' | 'list') => void;
  className?: string;
}

export function Navigation({ activeView, onViewChange, className = '' }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'add' as const, label: 'Add Expense', icon: Plus },
    { id: 'list' as const, label: 'All Expenses', icon: List },
  ];

  return (
    <nav className={`flex flex-col gap-2 ${className}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={activeView === item.id ? 'default' : 'ghost'}
            className={`justify-start ${activeView === item.id ? '' : 'hover:bg-accent'}`}
            onClick={() => onViewChange(item.id)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}