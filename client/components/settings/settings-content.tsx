import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  User,
  Building,
  Shield,
  Bell,
  Database,
  Settings as SettingsIcon,
  Key,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Account settings
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    company: "Crypto Advisors LLC",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",

    // Preferences
    defaultCurrency: "USD",
    costBasisMethod: "FIFO",
    roundingPrecision: "2",
    taxYear: "2023",

    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    monthlyReports: true,
    anomalyAlerts: true,

    // Security
    twoFactorAuth: true,
    apiAccess: false,
    sessionTimeout: "60",

    // Data Management
    autoBackup: true,
    dataRetention: "7",
    exportFormat: "CSV",
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="app-content">
      {/* Header */}
      <div className="page-titlebar">
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <h1 className="text-display-lg font-bold text-foreground">
              General Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account and application preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 size-4" />
              Reset to Defaults
            </Button>
            <Button size="sm" onClick={() => handleSave()} disabled={isLoading}>
              <Save className="mr-2 size-4" />
              {isLoading ? "Saving..." : "Save All"}
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="account" className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="size-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={settings.firstName}
                      onChange={(e) =>
                        updateSetting("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={settings.lastName}
                      onChange={(e) =>
                        updateSetting("lastName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => updateSetting("phone", e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave()} disabled={isLoading}>
                  <Save className="mr-2 size-4" />
                  Save Personal Info
                </Button>
              </CardContent>
            </Card>

            {/* Organization Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="size-5" />
                  Organization Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={settings.company}
                    onChange={(e) => updateSetting("company", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => updateSetting("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleSave()} disabled={isLoading}>
                  <Save className="mr-2 size-4" />
                  Save Organization Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            {/* Tax Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="size-5" />
                  Tax Calculation Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <Select
                      value={settings.defaultCurrency}
                      onValueChange={(value) =>
                        updateSetting("defaultCurrency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">
                          CAD - Canadian Dollar
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costBasisMethod">Cost Basis Method</Label>
                    <Select
                      value={settings.costBasisMethod}
                      onValueChange={(value) =>
                        updateSetting("costBasisMethod", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FIFO">
                          FIFO (First In, First Out)
                        </SelectItem>
                        <SelectItem value="LIFO">
                          LIFO (Last In, First Out)
                        </SelectItem>
                        <SelectItem value="HIFO">
                          HIFO (Highest In, First Out)
                        </SelectItem>
                        <SelectItem value="Specific">
                          Specific Identification
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roundingPrecision">
                      Rounding Precision
                    </Label>
                    <Select
                      value={settings.roundingPrecision}
                      onValueChange={(value) =>
                        updateSetting("roundingPrecision", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 decimal places</SelectItem>
                        <SelectItem value="2">2 decimal places</SelectItem>
                        <SelectItem value="4">4 decimal places</SelectItem>
                        <SelectItem value="8">8 decimal places</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxYear">Default Tax Year</Label>
                    <Select
                      value={settings.taxYear}
                      onValueChange={(value) => updateSetting("taxYear", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => handleSave()} disabled={isLoading}>
                  <Save className="mr-2 size-4" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="size-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-body-md text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting("emailNotifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-body-md text-muted-foreground">
                        Receive push notifications in browser
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting("pushNotifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-body-md text-muted-foreground">
                        Receive weekly summary reports
                      </p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) =>
                        updateSetting("weeklyReports", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Monthly Reports</Label>
                      <p className="text-body-md text-muted-foreground">
                        Receive monthly summary reports
                      </p>
                    </div>
                    <Switch
                      checked={settings.monthlyReports}
                      onCheckedChange={(checked) =>
                        updateSetting("monthlyReports", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Anomaly Alerts</Label>
                      <p className="text-body-md text-muted-foreground">
                        Get notified about data anomalies
                      </p>
                    </div>
                    <Switch
                      checked={settings.anomalyAlerts}
                      onCheckedChange={(checked) =>
                        updateSetting("anomalyAlerts", checked)
                      }
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave()} disabled={isLoading}>
                  <Save className="mr-2 size-4" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-body-md text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          settings.twoFactorAuth ? "default" : "secondary"
                        }
                      >
                        {settings.twoFactorAuth ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) =>
                          updateSetting("twoFactorAuth", checked)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API Access</Label>
                      <p className="text-body-md text-muted-foreground">
                        Allow API access to your account
                      </p>
                    </div>
                    <Switch
                      checked={settings.apiAccess}
                      onCheckedChange={(checked) =>
                        updateSetting("apiAccess", checked)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      Session Timeout (minutes)
                    </Label>
                    <Select
                      value={settings.sessionTimeout}
                      onValueChange={(value) =>
                        updateSetting("sessionTimeout", value)
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Password Management</h4>
                  <div className="flex gap-4">
                    <Button variant="outline">
                      <Key className="mr-2 size-4" />
                      Change Password
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 size-4" />
                      Download API Keys
                    </Button>
                  </div>
                </div>

                <Button onClick={() => handleSave()} disabled={isLoading}>
                  <Save className="mr-2 size-4" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="size-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Backups</Label>
                      <p className="text-body-md text-muted-foreground">
                        Automatically backup your data daily
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) =>
                        updateSetting("autoBackup", checked)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">
                      Data Retention (years)
                    </Label>
                    <Select
                      value={settings.dataRetention}
                      onValueChange={(value) =>
                        updateSetting("dataRetention", value)
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="5">5 years</SelectItem>
                        <SelectItem value="7">7 years</SelectItem>
                        <SelectItem value="10">10 years</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exportFormat">Default Export Format</Label>
                    <Select
                      value={settings.exportFormat}
                      onValueChange={(value) =>
                        updateSetting("exportFormat", value)
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Data Operations</h4>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline">
                      <Download className="mr-2 size-4" />
                      Export All Data
                    </Button>
                    <Button variant="outline">
                      <Upload className="mr-2 size-4" />
                      Import Data
                    </Button>
                    <Button
                      variant="outline"
                      className="text-error hover:text-error/80"
                    >
                      <AlertTriangle className="mr-2 size-4" />
                      Delete All Data
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Info className="size-4" />
                  <AlertDescription>
                    We recommend keeping data for at least 7 years for tax
                    compliance purposes.
                  </AlertDescription>
                </Alert>

                <Button onClick={() => handleSave()} disabled={isLoading}>
                  <Save className="mr-2 size-4" />
                  Save Data Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
