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
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme, type Theme } from "@/components/theme-provider";
import {
  Save,
  Palette,
  Monitor,
  Smartphone,
  Layout,
  Bell,
  Mouse,
  Keyboard,
  Globe,
  Eye,
  Moon,
  Sun,
  Settings,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";

export function PreferencesContent() {
  const [activeTab, setActiveTab] = useState("appearance");
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    // Appearance
    theme: "system",
    colorScheme: "blue",
    fontSize: 14,
    density: "comfortable",
    animations: true,
    reducedMotion: false,

    // Layout
    sidebarPosition: "left",
    sidebarWidth: 264,
    tableSize: "medium",
    showGridLines: true,
    compactMode: false,

    // Behavior
    autoSave: true,
    autoRefresh: true,
    refreshInterval: 30,
    confirmActions: true,
    soundEffects: false,

    // Language & Region
    language: "en-US",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    numberFormat: "US",

    // Accessibility
    screenReader: false,
    highContrast: false,
    focusIndicators: true,
    keyboardNavigation: true,
  });

  const handleSave = async (section: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const colorSchemes = [
    { value: "blue", label: "Blue", color: "bg-chart-blue" },
    { value: "green", label: "Green", color: "bg-success" },
    { value: "purple", label: "Purple", color: "bg-category-purple" },
    { value: "orange", label: "Orange", color: "bg-chart-orange" },
    { value: "red", label: "Red", color: "bg-error" },
  ];

  return (
    <div className="app-content">
      {/* Header */}
      <div className="page-titlebar">
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Preferences</h1>
            <p className="text-muted-foreground">
              Customize your application experience
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button
              size="sm"
              onClick={() => handleSave("all")}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save All"}
            </Button>
          </div>
        </div>

        {/* Preference Tabs */}
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="appearance" className="space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme & Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <RadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as Theme)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label
                        htmlFor="light"
                        className="flex items-center gap-2"
                      >
                        <Sun className="h-4 w-4" />
                        Light
                      </Label>
                    </div>
                    {/* Dark is gated: full dark-mode visual coverage is not yet
                        complete (status surfaces, charts, and some literals are
                        not dark-tuned), so we don't ship a half-dark UI. */}
                    <div className="flex items-center space-x-2 opacity-60">
                      <RadioGroupItem value="dark" id="dark" disabled />
                      <Label
                        htmlFor="dark"
                        className="flex items-center gap-2 cursor-not-allowed"
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                        <span className="text-xs text-muted-foreground">
                          (coming soon)
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label
                        htmlFor="system"
                        className="flex items-center gap-2"
                      >
                        <Monitor className="h-4 w-4" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Color Scheme</Label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorSchemes.map((scheme) => (
                      <button
                        key={scheme.value}
                        onClick={() =>
                          updatePreference("colorScheme", scheme.value)
                        }
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                          preferences.colorScheme === scheme.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full ${scheme.color}`}
                        />
                        <span className="text-sm font-medium">
                          {scheme.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Font Size: {preferences.fontSize}px</Label>
                  <Slider
                    value={[preferences.fontSize]}
                    onValueChange={(value) =>
                      updatePreference("fontSize", value[0])
                    }
                    min={12}
                    max={20}
                    step={1}
                    className="w-full max-w-sm"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Interface Density</Label>
                  <Select
                    value={preferences.density}
                    onValueChange={(value) =>
                      updatePreference("density", value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable smooth transitions and animations
                      </p>
                    </div>
                    <Switch
                      checked={preferences.animations}
                      onCheckedChange={(checked) =>
                        updatePreference("animations", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Minimize motion for accessibility
                      </p>
                    </div>
                    <Switch
                      checked={preferences.reducedMotion}
                      onCheckedChange={(checked) =>
                        updatePreference("reducedMotion", checked)
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleSave("appearance")}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Appearance
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            {/* Layout Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Layout & Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Sidebar Position</Label>
                  <RadioGroup
                    value={preferences.sidebarPosition}
                    onValueChange={(value) =>
                      updatePreference("sidebarPosition", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="left" />
                      <Label htmlFor="left">Left</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="right" />
                      <Label htmlFor="right">Right</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Sidebar Width: {preferences.sidebarWidth}px</Label>
                  <Slider
                    value={[preferences.sidebarWidth]}
                    onValueChange={(value) =>
                      updatePreference("sidebarWidth", value[0])
                    }
                    min={200}
                    max={400}
                    step={8}
                    className="w-full max-w-sm"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Table Size</Label>
                  <Select
                    value={preferences.tableSize}
                    onValueChange={(value) =>
                      updatePreference("tableSize", value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Grid Lines</Label>
                      <p className="text-sm text-muted-foreground">
                        Display grid lines in tables
                      </p>
                    </div>
                    <Switch
                      checked={preferences.showGridLines}
                      onCheckedChange={(checked) =>
                        updatePreference("showGridLines", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use compact spacing throughout the app
                      </p>
                    </div>
                    <Switch
                      checked={preferences.compactMode}
                      onCheckedChange={(checked) =>
                        updatePreference("compactMode", checked)
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleSave("layout")}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Layout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            {/* Behavior Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Application Behavior
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Save</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save changes
                      </p>
                    </div>
                    <Switch
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) =>
                        updatePreference("autoSave", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Refresh</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically refresh data
                      </p>
                    </div>
                    <Switch
                      checked={preferences.autoRefresh}
                      onCheckedChange={(checked) =>
                        updatePreference("autoRefresh", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Confirm Actions</Label>
                      <p className="text-sm text-muted-foreground">
                        Show confirmation dialogs for destructive actions
                      </p>
                    </div>
                    <Switch
                      checked={preferences.confirmActions}
                      onCheckedChange={(checked) =>
                        updatePreference("confirmActions", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for notifications and actions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {preferences.soundEffects ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                      <Switch
                        checked={preferences.soundEffects}
                        onCheckedChange={(checked) =>
                          updatePreference("soundEffects", checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>
                    Auto Refresh Interval: {preferences.refreshInterval} seconds
                  </Label>
                  <Slider
                    value={[preferences.refreshInterval]}
                    onValueChange={(value) =>
                      updatePreference("refreshInterval", value[0])
                    }
                    min={10}
                    max={300}
                    step={10}
                    className="w-full max-w-sm"
                    disabled={!preferences.autoRefresh}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Language & Region</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) =>
                          updatePreference("language", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                          <SelectItem value="fr-FR">Français</SelectItem>
                          <SelectItem value="de-DE">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={preferences.dateFormat}
                        onValueChange={(value) =>
                          updatePreference("dateFormat", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          <SelectItem value="DD MMM YYYY">
                            DD MMM YYYY
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSave("behavior")}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Behavior
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            {/* Accessibility Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Screen Reader Support</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable screen reader optimizations
                      </p>
                    </div>
                    <Switch
                      checked={preferences.screenReader}
                      onCheckedChange={(checked) =>
                        updatePreference("screenReader", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Switch
                      checked={preferences.highContrast}
                      onCheckedChange={(checked) =>
                        updatePreference("highContrast", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Focus Indicators</Label>
                      <p className="text-sm text-muted-foreground">
                        Show visible focus indicators
                      </p>
                    </div>
                    <Switch
                      checked={preferences.focusIndicators}
                      onCheckedChange={(checked) =>
                        updatePreference("focusIndicators", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Keyboard Navigation</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable full keyboard navigation
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Keyboard className="h-4 w-4" />
                      <Switch
                        checked={preferences.keyboardNavigation}
                        onCheckedChange={(checked) =>
                          updatePreference("keyboardNavigation", checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-info-bg rounded-lg border border-info">
                  <h4 className="font-medium text-info-text mb-2">
                    Keyboard Shortcuts
                  </h4>
                  <div className="space-y-2 text-sm text-info-text">
                    <div className="flex justify-between">
                      <span>Open search</span>
                      <kbd className="px-2 py-1 bg-info-bg rounded">
                        Ctrl + K
                      </kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Navigate tabs</span>
                      <kbd className="px-2 py-1 bg-info-bg rounded">
                        Ctrl + 1-9
                      </kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Save</span>
                      <kbd className="px-2 py-1 bg-info-bg rounded">
                        Ctrl + S
                      </kbd>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSave("accessibility")}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Accessibility
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
