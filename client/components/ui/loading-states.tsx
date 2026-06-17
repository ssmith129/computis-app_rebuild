import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, type LucideIcon } from "lucide-react";

// Table Loading Skeleton
export function TableLoadingSkeleton({
  rows = 5,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Card Loading Skeleton
export function CardLoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </CardContent>
    </Card>
  );
}

// Dashboard Cards Loading
export function DashboardCardsLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="size-5 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Spinner Loading Component
export function SpinnerLoading({
  size = "sm",
  text,
}: {
  size?: "sm" | "md" | "lg";
  text?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center space-x-2 p-4">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

// Page Loading Component
export function PageLoading() {
  return (
    <div className="app-content">
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Cards Skeleton */}
        <DashboardCardsLoading />

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <TableLoadingSkeleton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Empty State Component
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="max-w-sm text-muted-foreground">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Error State Component
export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error while loading this content.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="rounded-full bg-red-50 p-4">
        <div className="flex size-8 items-center justify-center rounded-full bg-red-500">
          <span className="text-sm font-bold text-white">!</span>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-red-900">{title}</h3>
        <p className="max-w-sm text-red-700">{description}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
