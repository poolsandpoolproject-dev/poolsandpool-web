# Scripts

## Add shadcn/ui Components

### Option 1: Using npm script (Recommended)
```bash
npm run add-components
```

### Option 2: Run script directly

**Mac/Linux:**
```bash
bash scripts/add-shadcn-components.sh
```

**Windows:**
```cmd
scripts\add-shadcn-components.bat
```

### Option 3: Add components individually (if you only need specific ones)
```bash
npx shadcn@latest add button --yes
npx shadcn@latest add input --yes
# etc...
```

## What the script adds:

- ✅ **button** - Primary UI button component
- ✅ **input** - Form input fields  
- ✅ **card** - Container component
- ✅ **form** - Form wrapper with validation
- ✅ **table** - Data table component
- ✅ **dialog** - Modal dialogs
- ✅ **select** - Dropdown select
- ✅ **badge** - Status badges (Active, Upcoming, etc.)
- ✅ **tabs** - Tab navigation
- ✅ **calendar** - Date picker (for temporary pricing)
- ✅ **label** - Form labels
- ✅ **textarea** - Text area inputs
- ✅ **switch** - Toggle switches (for enable/disable)
- ✅ **sheet** - Sidebar/drawer component
- ✅ **dropdown-menu** - User menu, actions menu
- ✅ **tooltip** - Hover tooltips
- ✅ **alert** - Alert/notification messages

After running the script, all components will be available in `components/ui/` and you can import them like:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
// etc...
```
