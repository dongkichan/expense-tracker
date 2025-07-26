# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an expense tracker application built with NextJS 14, TypeScript, and Tailwind CSS. The application uses localStorage for data persistence and follows a client-side, offline-first architecture.

## Development Commands

Once initialized, the project will use these standard NextJS commands:
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run tests
npm run lint     # Run ESLint
npm run format   # Run Prettier
```

## Architecture

### Technology Stack
- **Framework**: NextJS 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React hooks (useState, useEffect, useContext)
- **Storage**: localStorage with JSON
- **Icons**: Lucide React
- **Charts**: Recharts
- **Dates**: date-fns

### Project Structure
```
src/
├── app/              # NextJS pages and routes
├── components/       
│   ├── ui/          # Base UI components (Button, Input, Card, etc.)
│   ├── forms/       # ExpenseForm component
│   ├── charts/      # Dashboard charts
│   └── layout/      # Header, Navigation components
├── lib/             
│   ├── types.ts     # TypeScript interfaces
│   ├── storage.ts   # localStorage service
│   └── utils.ts     # Helper functions
└── hooks/           # Custom hooks (useExpenses, useLocalStorage)
```

### Key Interfaces
```typescript
interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Transportation' | 'Entertainment' | 'Utilities' | 'Healthcare' | 'Other';
  description: string;
  date: string;
}

interface ExpenseFormData {
  amount: string;
  category: Expense['category'];
  description: string;
  date: string;
}
```

### Core Features
1. **Expense Management**: CRUD operations with form validation
2. **Categories**: 6 predefined categories (Food, Transportation, Entertainment, Utilities, Healthcare, Other)
3. **Filtering**: By category, date range, search
4. **Dashboard**: Summary statistics and charts
5. **Export**: CSV download functionality
6. **Responsive**: Mobile-first design

### Storage Pattern
All data is stored in localStorage using a custom storage service:
- Key: `expenses`
- Format: JSON array of Expense objects
- Includes error handling for quota exceeded

### Testing Approach
- Unit tests with React Testing Library
- Focus on: localStorage operations, form validation, data transformations
- Integration tests for user flows
- E2E tests for critical paths

## Important Notes

1. **No Backend**: This is a client-side only application
2. **Offline-First**: All data persists in localStorage
3. **Form Validation**: Amount must be positive, all fields required
4. **Date Format**: ISO 8601 strings (YYYY-MM-DD)
5. **Mobile Support**: Responsive design is required
6. **Accessibility**: ARIA labels and keyboard navigation support

## References

Detailed specifications are in `.kiro/specs/expense-tracker/`:
- `requirements.md`: User stories and acceptance criteria
- `design.md`: Technical architecture and UI specifications  
- `tasks.md`: Implementation roadmap with 14 major tasks