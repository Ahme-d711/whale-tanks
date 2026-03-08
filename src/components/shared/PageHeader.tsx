import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface ActionButton {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ElementType;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actionButtons?: ActionButton[];
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs, 
  actionButtons,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold text-content-primary tracking-tight">
          {title}
        </h1>
        
        {/* Breadcrumbs for internal pages */}
        {breadcrumbs && (
          <nav className="flex items-center gap-1.5 text-sm font-medium">
            {breadcrumbs.map((item, index) => (
              <div key={item.label} className="flex items-center gap-1.5 cursor-pointer">
                {item.href ? (
                  <Link 
                    href={item.href}
                    className="text-content-secondary hover:underline transition-all"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={cn(
                    index === breadcrumbs.length - 1 ? "text-primary" : "text-secondary"
                  )}>
                    {item.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-content-secondary opacity-50" />
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Description for Home page */}
        {description && (
          <p className="text-base text-content-secondary">
            {description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {actionButtons && (
        <div className="flex items-center gap-3">
          {actionButtons.map((action, idx) => {
            const Icon = action.icon;
            const content = (
               <>
                 {Icon && <Icon className="h-4 w-4" />}
                 {action.label}
               </>
            );
            
            const btnClasses = cn(
               "cursor-pointer rounded-xl h-11 px-6 gap-2 font-semibold shadow-none",
               action.className
            );

            if (action.href) {
              return (
                <Link key={idx} href={action.href}>
                   <Button variant={action.variant || "default"} className={btnClasses}>
                     {content}
                   </Button>
                </Link>
              )
            }
            
            return (
               <Button key={idx} variant={action.variant || "default"} onClick={action.onClick} className={btnClasses}>
                 {content}
               </Button>
            )
          })}
        </div>
      )}
    </div>
  );
}
