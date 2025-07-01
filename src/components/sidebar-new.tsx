'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  FileText, 
  Calendar, 
  PenTool, 
  BarChart3,
  FileBarChart,
  Users,
  GitBranch,
  Settings,
  Sparkles,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navigation = [
  { name: 'Posts', href: '/', icon: FileText, description: 'Manage your blog posts' },
  { name: 'Calendar', href: '/calendar', icon: Calendar, description: 'View posts by date' },
  { name: 'Planning', href: '/planning', icon: PenTool, description: 'Plan your content strategy' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Track performance metrics' },
  { name: 'Reports', href: '/reports', icon: FileBarChart, description: 'Generate detailed reports' },
  { name: 'Team', href: '/team', icon: Users, description: 'Manage team members' },
  { name: 'Workflow', href: '/workflow', icon: GitBranch, description: 'Content workflow management' },
  { name: 'Settings', href: '/settings', icon: Settings, description: 'Configure your dashboard' },
]

interface SidebarProps {
  className?: string
}

export function SidebarNew({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const SidebarContent = ({ isSheet = false }: { isSheet?: boolean }) => (
    <div className={cn("flex h-full flex-col border-r bg-background", className)}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className={cn("flex items-center space-x-2", collapsed && !isSheet && "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          {(!collapsed || isSheet) && (
            <h1 className="text-lg font-semibold">
              Blog Dashboard
            </h1>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!isSheet && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <TooltipProvider>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            const ButtonContent = (
              <Button
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary text-secondary-foreground",
                  collapsed && !isSheet && "justify-center px-2"
                )}
              >
                <Link href={item.href}>
                  <Icon className={cn("h-4 w-4", (!collapsed || isSheet) && "mr-3")} />
                  {(!collapsed || isSheet) && item.name}
                </Link>
              </Button>
            )

            if (collapsed && !isSheet) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    {ButtonContent}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.name}>{ButtonContent}</div>
          })}
        </TooltipProvider>
      </nav>
      
      <Separator />
      
      {/* Footer */}
      <div className="p-4">
        <div className={cn(
          "rounded-lg bg-muted/50 p-3",
          collapsed && !isSheet && "p-2"
        )}>
          <div className={cn(
            "flex items-center space-x-2 text-xs text-muted-foreground",
            collapsed && !isSheet && "justify-center"
          )}>
            <Sparkles className="h-3 w-3 flex-shrink-0" />
            {(!collapsed || isSheet) && (
              <div>
                <p className="font-medium">AI-Powered Dashboard</p>
                <p>Built with Claude Sonnet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent isSheet />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )

