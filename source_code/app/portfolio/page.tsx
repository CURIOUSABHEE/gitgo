import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PortfolioPreview } from "@/components/portfolio/portfolio-preview"
import { PortfolioControls } from "@/components/portfolio/portfolio-controls"

export default function PortfolioPage() {
  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader title="Portfolio Builder" />

      <div className="flex flex-1 overflow-hidden">
        {/* Main preview area */}
        <div className="flex-1 overflow-auto bg-background p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Draft Portfolio
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Auto-generated from your GitHub activity and resume
            </p>
          </div>
          <PortfolioPreview />
        </div>

        {/* Sidebar controls */}
        <PortfolioControls />
      </div>
    </div>
  )
}
