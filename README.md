# Expense Tracker

A modern expense tracking application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Add and manage expenses** with categories, amounts, descriptions, and dates
- **6 predefined categories**: Food, Transportation, Entertainment, Utilities, Healthcare, Other
- **Dashboard with visual analytics** using Recharts
- **Filter and search** expenses by category, date range, or description
- **CSV export/import** functionality
- **Responsive design** that works on desktop and mobile
- **Local storage persistence** - all data stored locally in browser
- **Real-time updates** across browser tabs

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dongkichan/expense-tracker.git
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Expenses
1. Click on "Add Expense" in the navigation
2. Fill in the amount, category, description, and date
3. Click "Add Expense" to save

### Viewing Expenses
- Navigate to "All Expenses" to see your complete expense list
- Use filters to narrow down expenses by category, date range, or search term
- Click edit icon to modify an expense
- Click delete icon (click twice to confirm) to remove an expense

### Dashboard
- View total expenses, monthly spending, and top categories
- See visual breakdowns with bar and pie charts
- Review your 5 most recent expenses

### Import/Export
- Export your expenses to CSV format for backup or analysis
- Import expenses from a properly formatted CSV file

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **Storage**: Browser localStorage

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run type-check # Run TypeScript type checking
```

### Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       
│   ├── ui/          # Reusable UI components
│   ├── forms/       # Form components
│   ├── charts/      # Chart components
│   └── layout/      # Layout components
├── hooks/           # Custom React hooks
└── lib/             # Utilities and types
```

## License

This project is open source and available under the [MIT License](LICENSE).