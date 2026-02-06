export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard Overview</h1>
        <p className="text-text-secondary mt-1">Welcome to the admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Total Menu Items</h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Active Events</h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Categories</h3>
          <p className="text-3xl font-bold text-primary">3</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/menu/items"
            className="p-4 border border-border rounded-lg hover:border-primary hover:bg-background-alt transition-colors"
          >
            <h3 className="font-medium text-text-primary mb-1">Add Menu Item</h3>
            <p className="text-sm text-text-secondary">Create a new menu item</p>
          </a>
          <a
            href="/admin/events/create"
            className="p-4 border border-border rounded-lg hover:border-primary hover:bg-background-alt transition-colors"
          >
            <h3 className="font-medium text-text-primary mb-1">Create Event</h3>
            <p className="text-sm text-text-secondary">Set up a new event with pricing</p>
          </a>
        </div>
      </div>
    </div>
  );
}
