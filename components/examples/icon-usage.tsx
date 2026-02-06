/**
 * Example: How to use lucide-react icons
 */

import { 
  Menu, 
  Home, 
  Settings, 
  User, 
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  ChevronDown,
  Search,
  Filter,
  Calendar,
  Clock,
  DollarSign,
  ShoppingCart,
  Image as ImageIcon
} from "lucide-react";

export function IconExamples() {
  return (
    <div className="space-y-4 p-4">
      {/* Navigation Icons */}
      <div className="flex gap-4">
        <Menu className="h-5 w-5 text-primary" />
        <Home className="h-5 w-5 text-primary" />
        <Settings className="h-5 w-5 text-primary" />
        <User className="h-5 w-5 text-primary" />
      </div>

      {/* Action Icons */}
      <div className="flex gap-4">
        <Plus className="h-4 w-4 text-success" />
        <Edit className="h-4 w-4 text-primary" />
        <Trash2 className="h-4 w-4 text-error" />
        <X className="h-4 w-4 text-text-secondary" />
        <Check className="h-4 w-4 text-success" />
      </div>

      {/* UI Icons */}
      <div className="flex gap-4">
        <ChevronDown className="h-4 w-4" />
        <Search className="h-4 w-4" />
        <Filter className="h-4 w-4" />
        <Calendar className="h-4 w-4" />
        <Clock className="h-4 w-4" />
        <DollarSign className="h-4 w-4" />
        <ShoppingCart className="h-4 w-4" />
        <ImageIcon className="h-4 w-4" />
      </div>

      {/* Icon with Button */}
      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
        <Plus className="h-5 w-5" />
        Add Item
      </button>

      {/* Icon with Size Variants */}
      <div className="flex items-center gap-4">
        <Menu className="h-4 w-4" /> {/* Small */}
        <Menu className="h-5 w-5" /> {/* Medium */}
        <Menu className="h-6 w-6" /> {/* Large */}
        <Menu className="h-8 w-8" /> {/* Extra Large */}
      </div>
    </div>
  );
}
