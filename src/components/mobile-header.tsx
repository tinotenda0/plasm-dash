'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, Sparkles } from 'lucide-react'
import { SidebarNew } from '@/components/sidebar-new'
import { ThemeToggle } from '@/components/theme-toggle'

interface MobileHeaderProps {
  title?: string
}

export function MobileHeader({ title = "Blog Dashboard" }: MobileHeaderProps) {
  return (
    <div className="md:hidden flex h-16 items-center justify-between px-4 border-b bg-background">
      <div className="flex items-center space-x-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col border-r bg-background">
              {/* Header */}
              <div className="flex h-16 items-center justify-between px-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h1 className="text-lg font-semibold">
                    Blog Dashboard
                  </h1>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
            <Sparkles className="h-3 w-3" />
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      </div>
      
      <ThemeToggle />
    </div>
  )
}
