import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  CreditCard,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

export default function MyAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <DashboardLayout activeItem="My Account">
      <div className="app-content bg-gray-50">
        {/* Page Header */}
        <div className="page-titlebar">
          <div className="flex flex-col p-6 text-left">
            <h1 className="text-heading-lg font-bold text-foreground">
              My Account
            </h1>
            <p className="mt-1 text-body-md text-muted-foreground">
              Manage your profile, preferences, and security settings
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="no-h-scroll space-y-6 p-4 sm:p-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="size-20 bg-info-bg">
                  <AvatarFallback className="bg-info-bg text-display-lg text-info">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-display-sm font-semibold text-gray-900">
                    John Smith
                  </h3>
                  <p className="text-gray-600">Premium User</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="default">Verified</Badge>
                    <Badge variant="secondary">Pro Plan</Badge>
                  </div>
                </div>
                <Button variant="outline">Change Photo</Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex">
                    <Mail className="mr-3 mt-3 size-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.smith@example.com"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex">
                    <Phone className="mr-3 mt-3 size-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex">
                    <MapPin className="mr-3 mt-3 size-4 text-gray-400" />
                    <Input
                      id="location"
                      defaultValue="New York, NY"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joined">Member Since</Label>
                  <div className="flex">
                    <Calendar className="mr-3 mt-3 size-4 text-gray-400" />
                    <Input
                      id="joined"
                      defaultValue="January 2023"
                      className="flex-1"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 h-auto -translate-y-1/2 p-1"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  Two-Factor Authentication
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-md text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Setup 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-body-md font-medium">
                    Email Notifications
                  </p>
                  <p className="text-caption text-gray-500">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-body-md font-medium">Push Notifications</p>
                  <p className="text-caption text-gray-500">
                    Receive browser notifications
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-body-md font-medium">Weekly Reports</p>
                  <p className="text-caption text-gray-500">
                    Get weekly summary emails
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-body-md font-medium">Security Alerts</p>
                  <p className="text-caption text-gray-500">
                    Alerts for account security events
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Billing & Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-info-bg p-4">
                <div>
                  <h4 className="font-medium text-info-text">Pro Plan</h4>
                  <p className="text-body-md text-info-text">
                    $29.99/month • Next billing: Feb 15, 2024
                  </p>
                </div>
                <Button variant="outline">Manage Plan</Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Payment Method</h4>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-8 items-center justify-center rounded bg-blue-600 text-caption text-white">
                      VISA
                    </div>
                    <span className="text-body-md">•••• •••• •••• 4567</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Update
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 size-4" />
                  Download Invoice
                </Button>
                <Button variant="outline" className="flex-1">
                  Billing History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
