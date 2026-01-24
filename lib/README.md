# Lib Directory Structure

## Data (`lib/data/`)
Dummy data for development. Will be replaced with API calls when backend is ready.

- `categories.ts` - Category data and helpers
- `sections.ts` - Section data and helpers  
- `menu-items.ts` - Menu item data and helpers
- `index.ts` - Central exports

## Store (`lib/store/`)
Zustand state management stores.

- `menu-store.ts` - Menu state management
- `admin-store.ts` - Admin dashboard state management
- `index.ts` - Central exports

## Validation (`lib/validation/`)
Zod validation schemas for form validation.

- `menu-schemas.ts` - Menu-related validation schemas
- `index.ts` - Central exports

## Usage Examples

### Using Data
```typescript
import { getEnabledCategories, getMenuItemsByCategoryId } from "@/lib/data";

const categories = getEnabledCategories();
const items = getMenuItemsByCategoryId("1");
```

### Using Store
```typescript
import { useMenuStore } from "@/lib/store";

function MyComponent() {
  const { categories, setCategories } = useMenuStore();
  // ...
}
```

### Using Validation
```typescript
import { menuItemSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(menuItemSchema),
  // ...
});
```
