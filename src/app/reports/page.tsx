import { ExportableReports } from '@/components/exportable-reports'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Export detailed reports and insights about your blog performance</p>
      </div>
      
      <ExportableReports />
    </div>
  )
}
