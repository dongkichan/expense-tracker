# Technology Stack

## Framework & Language
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **React 18** for UI components

## Styling & UI
- **Tailwind CSS** for styling with utility classes
- **Lucide React** for icons
- Custom UI components in `components/ui/`
- Responsive design patterns

## Libraries & Dependencies
- **Recharts** for data visualization and charts
- **date-fns** for date manipulation and formatting
- **ESLint** for code linting
- **PostCSS** and **Autoprefixer** for CSS processing

## Build System & Commands

### Development
```bash
npm run dev      # Start development server on localhost:3000
npm run lint     # Run ESLint for code quality
npm run type-check # Run TypeScript type checking
```

### Production
```bash
npm run build    # Build optimized production bundle
npm run start    # Start production server
```

## Configuration Files
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules
- `postcss.config.js` - PostCSS configuration

## Path Aliases
- `@/*` maps to project root for clean imports