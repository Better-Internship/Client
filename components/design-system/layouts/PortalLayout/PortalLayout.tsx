import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Unified Portal Layout Component
 * Consistent layout structure across all three portals with responsive behavior
 */

export interface PortalLayoutProps {
  children: React.ReactNode;
  portal: "student" | "hire" | "school";
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

const PortalLayout = React.forwardRef<HTMLDivElement, PortalLayoutProps>(
  ({ 
    children, 
    portal, 
    header, 
    sidebar, 
    footer, 
    className,
    sidebarCollapsed = false,
    onSidebarToggle,
    ...props 
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "min-h-screen bg-background",
          // Portal-specific data attributes for theming
          `data-portal-${portal}`,
          className
        )}
        {...props}
      >
        {/* Header */}
        {header && (
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {header}
          </header>
        )}

        {/* Main Content Area */}
        <div className="flex h-full">
          {/* Sidebar */}
          {sidebar && (
            <>
              {/* Desktop Sidebar */}
              <aside 
                className={cn(
                  "hidden md:flex flex-col border-r bg-background transition-all duration-300",
                  sidebarCollapsed ? "w-16" : "w-64"
                )}
              >
                {sidebar}
              </aside>

              {/* Mobile Sidebar Overlay */}
              <div 
                className={cn(
                  "fixed inset-0 z-40 md:hidden",
                  sidebarCollapsed ? "hidden" : "block"
                )}
              >
                <div 
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                  onClick={onSidebarToggle}
                />
                <aside className="relative flex flex-col w-64 h-full border-r bg-background">
                  {sidebar}
                </aside>
              </div>
            </>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>

        {/* Footer */}
        {footer && (
          <footer className="border-t bg-background">
            {footer}
          </footer>
        )}
      </div>
    );
  }
);

PortalLayout.displayName = "PortalLayout";

export { PortalLayout };
