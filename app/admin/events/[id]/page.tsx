export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Event Details</h1>
        <p className="text-text-secondary mt-1">Event ID: {params.id}</p>
      </div>

      <div className="bg-white border border-border rounded-lg p-6">
        <p className="text-text-secondary">Event detail form with menu price selection will be displayed here</p>
        <p className="text-sm text-text-light mt-2">API integration pending</p>
      </div>
    </div>
  );
}
