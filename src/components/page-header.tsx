'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Menu, Sparkles } from 'lucide-react'
import { SidebarNew } from '@/components/sidebar-new'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  actions?: React.ReactNode
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="border-b bg-background">
      {/* Mobile header */}
      <div className="md:hidden flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <ScrollArea className="h-full">
                <div className="flex h-full flex-col border-r bg-background">
                  {/* Header */}
                  <div className="flex h-16 items-center px-4 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <h1 className="text-lg font-semibold">
                        Blog Dashboard
                      </h1>
                    </div>
                  </div>
                  {/* This would contain the navigation - for now using a placeholder */}
                  <div className="flex-1 p-4">
                    <p className="text-sm text-muted-foreground">Navigation will be here</p>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <Sparkles className="h-3 w-3" />
            </div>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {actions}
          <ThemeToggle />
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            {breadcrumbs && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {breadcrumb.href ? (
                          <BreadcrumbLink href={breadcrumb.href}>
                            {breadcrumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        </div>
        
        {/* Title and description */}
        <div className="px-6 pb-4">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
