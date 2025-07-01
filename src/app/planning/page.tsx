import { PlanningHeader } from '@/components/planning-header'
import { PlanningBoard } from '@/components/planning-board'

export default function PlanningPage() {
  return (
    <div className="flex flex-col h-full">
      <PlanningHeader />
      <div className="flex-1 overflow-auto">
        <PlanningBoard />
      </div>
    </div>
  )
}
