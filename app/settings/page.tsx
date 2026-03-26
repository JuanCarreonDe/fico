import { Button } from "@/components/ui/button";
import AccountForm from "../accounts/account-form";
import CategoryForm from "../categories/category-form";
import { LogoutButton } from "@/components/logout-button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">My options</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Customize your account and categories options
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Accounts</span>
              <div className="flex gap-2 ">
                <Button variant={"outline"}>Edit</Button>
                <AccountForm />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Categories</span>
              <div className="flex gap-2">
                <Button variant={"outline"}>Edit</Button>
                <CategoryForm />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Profile Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Update your personal information
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Email</span>
              <span className="text-sm text-muted-foreground">
                user@example.com
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Name</span>
              <span className="text-sm text-muted-foreground">John Doe</span>
            </div>
            <div className="flex w-full justify-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
