# Project Structure

## Directory Organization

```
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # Reusable UI components (Button, Input, Card, etc.)
│   ├── forms/         # Form-specific components
│   ├── charts/        # Chart and visualization components
│   ├── layout/        # Layout-related components
│   └── ExpenseList.tsx # Main expense list component
├── hooks/             # Custom React hooks
│   ├── useExpenses.ts # Main expense management hook
│   └── useLocalStorage.ts # Local storage utilities
├── lib/               # Utilities and shared code
│   ├── types.ts       # TypeScript type definitions
│   ├── storage.ts     # Local storage service
│   └── utils.ts       # General utility functions
└── [config files]     # Various configuration files
```

## Architecture Patterns

### Component Organization
- **UI Components**: Reusable, generic components in `components/ui/`
- **Feature Components**: Domain-specific components at component root
- **Layout Components**: Navigation and layout structure in `components/layout/`

### State Management
- Custom hooks for business logic (e.g., `useExpenses`)
- Local storage for data persistence
- React state for UI interactions

### Type Safety
- Centralized type definitions in `lib/types.ts`
- Strict TypeScript configuration
- Interface-driven development

### Styling Conventions
- Utility-first approach with Tailwind CSS
- Consistent spacing and color schemes
- Responsive design with mobile-first approach
- Component-scoped styling patterns

### File Naming
- PascalCase for React components
- camelCase for hooks and utilities
- kebab-case for configuration files
- Descriptive, feature-based naming