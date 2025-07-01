'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FileText, 
  Calendar, 
  PenTool, 
  BarChart3,
  FileBarChart,
  Users,
  GitBranch,
  Settings,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const navigation = [
  { name: 'Posts', href: '/', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Planning', href: '/planning', icon: PenTool },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Workflow', href: '/workflow', icon: GitBranch },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <h1 className="text-lg font-semibold">
            Blog Dashboard
          </h1>
        </div>
        <ThemeToggle />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-secondary text-secondary-foreground"
              )}
            >
              <Link href={item.href}>
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          )
        })}
      </nav>
      
      <Separator />
      
      {/* Footer */}
      <div className="p-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <div>
              <p className="font-medium">AI-Powered Dashboard</p>
              <p>Built with Claude Sonnet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
