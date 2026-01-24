# Components Directory

This directory will contain reusable UI components.

## Recommended Setup: shadcn/ui

shadcn/ui is a collection of re-usable components built using Radix UI and Tailwind CSS.

### Installation Steps:

1. **Install dependencies** (already added to package.json):
   ```bash
   npm install
   ```

2. **Initialize shadcn/ui**:
   ```bash
   npx shadcn@latest init
   ```
   
   This will:
   - Set up components.json
   - Configure your project for shadcn/ui
   - Ask you about styling preferences (we're using Tailwind CSS)

3. **Add components as needed**:
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add input
   npx shadcn@latest add card
   npx shadcn@latest add form
   npx shadcn@latest add table
   npx shadcn@latest add dialog
   npx shadcn@latest add select
   npx shadcn@latest add badge
   npx shadcn@latest add tabs
   ```

## Component Structure

```
components/
├── ui/              # shadcn/ui components (Button, Input, Card, etc.)
├── public/          # Public-facing components
│   ├── menu/
│   └── menu-item-card/
├── admin/           # Admin dashboard components
│   ├── sidebar/
│   ├── header/
│   ├── forms/
│   └── tables/
└── shared/          # Shared components used by both public and admin
    ├── button/
    ├── input/
    └── modal/
```

## Using Icons (lucide-react)

```tsx
import { Menu, Home, Settings, User } from "lucide-react";

export default function MyComponent() {
  return (
    <button>
      <Menu className="h-5 w-5" />
      Menu
    </button>
  );
}
```

## Recommended Components to Add

### Essential Components:
- `button` - Primary UI button component
- `input` - Form input fields
- `card` - Container component
- `form` - Form wrapper with validation
- `table` - Data table component
- `dialog` - Modal dialogs
- `select` - Dropdown select
- `badge` - Status badges (Active, Upcoming, etc.)
- `tabs` - Tab navigation
- `calendar` - Date picker (for temporary pricing)
- `label` - Form labels
- `textarea` - Text area inputs
- `switch` - Toggle switches (for enable/disable)

### Admin Dashboard Specific:
- `sheet` - Sidebar/drawer component
- `dropdown-menu` - User menu, actions menu
- `tooltip` - Hover tooltips
- `alert` - Alert/notification messages
- `separator` - Visual separators
