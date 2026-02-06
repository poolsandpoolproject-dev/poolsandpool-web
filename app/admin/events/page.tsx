export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Events</h1>
          <p className="text-text-secondary mt-1">Manage events and event pricing</p>
        </div>
        <a
          href="/admin/events/create"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
        >
          + Create Event
        </a>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="font-semibold text-text-primary mb-2">Active Events</h3>
          <p className="text-text-secondary text-sm">No active events</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="font-semibold text-text-primary mb-2">Upcoming Events</h3>
          <p className="text-text-secondary text-sm">No upcoming events</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <h3 className="font-semibold text-text-primary mb-2">Completed Events</h3>
          <p className="text-text-secondary text-sm">No completed events</p>
        </div>
      </div>
    </div>
  );
}
