export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-muted-foreground">
        Manage your application settings and preferences.
      </p>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Profile Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">Update your personal information</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Email</span>
              <span className="text-sm text-muted-foreground">user@example.com</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Name</span>
              <span className="text-sm text-muted-foreground">John Doe</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Preferences</h3>
          <p className="text-sm text-muted-foreground mb-4">Customize your experience</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Language</span>
              <span className="text-sm text-muted-foreground">English</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Theme</span>
              <span className="text-sm text-muted-foreground">System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
