import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  TrendingUp,
  Wallet,
  Activity,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function DesignSystemShowcase() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-lg font-semibold tracking-tight">
            Computis Design System v2.0
          </h1>
          <p className="text-body-md text-muted-foreground">
            Comprehensive showcase of the optimized design system with improved
            density and usability
          </p>
        </div>

        <Separator />

        {/* Typography Section */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-2 text-heading-md font-semibold">
              Typography Scale
            </h2>
            <p className="text-body-sm text-muted-foreground">
              Optimized type scale for better data density (15-20% reduction)
            </p>
          </div>

          <Card className="p-standard">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  Display Large (24px)
                </p>
                <p className="text-display-lg font-bold">$1,234,567.89</p>
              </div>
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  Display Small (20px)
                </p>
                <p className="text-display-sm font-bold">
                  Total Portfolio Value
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  Heading Large (18px)
                </p>
                <p className="text-heading-lg font-semibold">
                  Page Title / Main Heading
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  Heading Medium (16px)
                </p>
                <p className="text-heading-md font-semibold">Section Title</p>
              </div>
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  Heading Small (14px)
                </p>
                <p className="text-heading-sm font-medium">Card Title</p>
              </div>
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  Body Medium (14px) - Default
                </p>
                <p className="text-body-md">
                  This is the default body text size optimized for readability.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  Body Small (13px)
                </p>
                <p className="text-body-sm">
                  Used for dense UI elements like table cells and compact
                  layouts.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-caption text-muted-foreground">
                  Caption (12px)
                </p>
                <p className="text-caption">
                  Labels, hints, and supplementary information
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Button Section */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-2 text-heading-md font-semibold">Buttons</h2>
            <p className="text-body-sm text-muted-foreground">
              Optimized button sizes: Small (32px), Medium (36px), Large (44px)
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Button Sizes */}
            <Card className="p-standard">
              <CardHeader>
                <CardTitle className="text-heading-sm">Button Sizes</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button size="sm">Small Button</Button>
                <Button size="default">Medium Button</Button>
                <Button size="lg">Large Button</Button>
              </CardContent>
            </Card>

            {/* Button Variants */}
            <Card className="p-standard">
              <CardHeader>
                <CardTitle className="text-heading-sm">
                  Button Variants
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="success">
                  <CheckCircle2 className="size-4" />
                  Success
                </Button>
                <Button variant="warning">
                  <AlertTriangle className="size-4" />
                  Warning
                </Button>
                <Button variant="destructive">
                  <XCircle className="size-4" />
                  Destructive
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badge Section */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-2 text-heading-md font-semibold">
              Status Badges
            </h2>
            <p className="text-body-sm text-muted-foreground">
              WCAG AA compliant semantic color variants
            </p>
          </div>

          <Card className="p-standard">
            <CardContent className="flex flex-wrap gap-3">
              <Badge variant="success">
                <CheckCircle2 className="mr-1 size-3" />
                Verified
              </Badge>
              <Badge variant="warning">
                <AlertTriangle className="mr-1 size-3" />
                Pending Review
              </Badge>
              <Badge variant="error">
                <XCircle className="mr-1 size-3" />
                Failed
              </Badge>
              <Badge variant="info">
                <Info className="mr-1 size-3" />
                Processing
              </Badge>
              <Badge variant="neutral">Draft</Badge>
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-2 text-heading-md font-semibold">
              Dashboard Cards
            </h2>
            <p className="text-body-sm text-muted-foreground">
              Optimized card layouts with improved padding (compact: 12px,
              standard: 16px, featured: 20px)
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Metric Card 1 */}
            <Card className="p-standard">
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-caption text-muted-foreground">
                    Total Portfolio
                  </p>
                  <Wallet className="size-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-display-sm font-bold">$1,234,567</p>
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="size-3" />
                    <span className="text-caption font-medium">+12.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric Card 2 */}
            <Card className="p-standard">
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-caption text-muted-foreground">
                    Transactions
                  </p>
                  <Activity className="size-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-display-sm font-bold">15,243</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">1,234 Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric Card 3 */}
            <Card className="p-standard">
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-caption text-muted-foreground">
                    Active Wallets
                  </p>
                  <Wallet className="size-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-display-sm font-bold">24</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">3 Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric Card 4 */}
            <Card className="p-standard">
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-caption text-muted-foreground">
                    Tax Liability
                  </p>
                  <Info className="size-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-display-sm font-bold">$45,678</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="info">2025 Estimate</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-2 text-heading-md font-semibold">
              Form Elements
            </h2>
            <p className="text-body-sm text-muted-foreground">
              Optimized input heights for better form density
            </p>
          </div>

          <Card className="p-standard">
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="wallet-address"
                    className="text-body-sm font-medium"
                  >
                    Wallet Address
                  </Label>
                  <Input
                    id="wallet-address"
                    placeholder="0x..."
                    className="h-input-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-body-sm font-medium">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="h-input-md"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button size="default">Submit Transaction</Button>
                <Button size="default" variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Table */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-2 text-heading-md font-semibold">Data Tables</h2>
            <p className="text-body-sm text-muted-foreground">
              Optimized table density: Header (36px), Rows (40px) - 16% more
              content per screen
            </p>
          </div>

          <Card className="p-0">
            <div className="p-standard border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-heading-sm font-medium">
                  Recent Transactions
                </h3>
                <Button size="sm" variant="outline">
                  <Download className="size-4" />
                  Export
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-caption">Date</TableHead>
                  <TableHead className="text-caption">Type</TableHead>
                  <TableHead className="text-caption">Asset</TableHead>
                  <TableHead className="text-caption">Amount</TableHead>
                  <TableHead className="text-caption">Value (USD)</TableHead>
                  <TableHead className="text-caption">Status</TableHead>
                  <TableHead className="text-right text-caption">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-body-sm">2026-02-08</TableCell>
                  <TableCell className="text-body-sm">Buy</TableCell>
                  <TableCell className="text-body-sm font-medium">
                    BTC
                  </TableCell>
                  <TableCell className="font-mono text-body-sm">
                    0.5000
                  </TableCell>
                  <TableCell className="font-mono text-body-sm">
                    $25,000.00
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Verified</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-body-sm">2026-02-07</TableCell>
                  <TableCell className="text-body-sm">Sell</TableCell>
                  <TableCell className="text-body-sm font-medium">
                    ETH
                  </TableCell>
                  <TableCell className="font-mono text-body-sm">
                    2.5000
                  </TableCell>
                  <TableCell className="font-mono text-body-sm">
                    $6,250.00
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning">Pending Review</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-body-sm">2026-02-06</TableCell>
                  <TableCell className="text-body-sm">Transfer</TableCell>
                  <TableCell className="text-body-sm font-medium">
                    USDT
                  </TableCell>
                  <TableCell className="font-mono text-body-sm">
                    1,000.00
                  </TableCell>
                  <TableCell className="font-mono text-body-sm">
                    $1,000.00
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">Processing</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-body-sm">2026-02-05</TableCell>
                  <TableCell className="text-body-sm">Stake</TableCell>
                  <TableCell className="text-body-sm font-medium">
                    SOL
                  </TableCell>
                  <TableCell className="font-mono text-body-sm">
                    50.0000
                  </TableCell>
                  <TableCell className="font-mono text-body-sm">
                    $4,500.00
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Verified</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* Color Palette */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-2 text-heading-md font-semibold">Color System</h2>
            <p className="text-body-sm text-muted-foreground">
              WCAG 2.1 AA compliant color palette with semantic status colors
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Primary Colors */}
            <Card className="p-standard">
              <CardHeader>
                <CardTitle className="text-heading-sm">
                  Primary & Accent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-md bg-primary"></div>
                  <div>
                    <p className="text-body-sm font-medium">Primary Blue</p>
                    <p className="text-caption text-muted-foreground">
                      #2563EB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-md bg-accent"></div>
                  <div>
                    <p className="text-body-sm font-medium">Computis Gold</p>
                    <p className="text-caption text-muted-foreground">
                      #D4AF37
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Semantic Colors */}
            <Card className="p-standard">
              <CardHeader>
                <CardTitle className="text-heading-sm">
                  Semantic Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-md bg-success"></div>
                  <div>
                    <p className="text-body-sm font-medium">Success</p>
                    <p className="text-caption text-muted-foreground">
                      #16A34A
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-md bg-warning"></div>
                  <div>
                    <p className="text-body-sm font-medium">Warning</p>
                    <p className="text-caption text-muted-foreground">
                      #B45309
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-md bg-error"></div>
                  <div>
                    <p className="text-body-sm font-medium">Error</p>
                    <p className="text-caption text-muted-foreground">
                      #DC2626
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Design System Summary */}
        <section className="space-y-4">
          <div>
            <h2 className="mb-2 text-heading-md font-semibold">
              Design System Impact
            </h2>
            <p className="text-body-sm text-muted-foreground">
              Key improvements and metrics
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-standard bg-success-soft border-success">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-caption text-success-text">
                    Space Efficiency
                  </p>
                  <p className="text-display-sm font-bold text-success-text">
                    +18%
                  </p>
                  <p className="text-body-sm text-success-text">
                    More content visible per screen
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-standard bg-info-soft border-info">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-caption text-info-text">
                    Component Density
                  </p>
                  <p className="text-display-sm font-bold text-info-text">
                    15-20%
                  </p>
                  <p className="text-body-sm text-info-text">
                    Reduction in component sizes
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-standard bg-warning-soft border-warning">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-caption text-warning-text">
                    Accessibility
                  </p>
                  <p className="text-display-sm font-bold text-warning-text">
                    WCAG AA
                  </p>
                  <p className="text-body-sm text-warning-text">
                    All colors meet contrast standards
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Documentation Link */}
        <Card className="p-standard border-primary bg-primary-light">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-heading-md font-semibold">
                  Complete Documentation
                </h3>
                <p className="text-body-sm text-muted-foreground">
                  For detailed usage guidelines, code examples, and best
                  practices, refer to the comprehensive design system
                  documentation.
                </p>
              </div>
              <Button variant="default" size="default">
                View Docs
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
