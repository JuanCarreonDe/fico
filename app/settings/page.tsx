"use client";
import { Button } from "@/components/ui/button";
import CategoryForm from "../categories/category-form";
import { LogoutButton } from "@/components/logout-button";
import { useAuth } from "@/components/auth-provider";
import { useState, useCallback, useEffect } from "react";
import { getProfile } from "./acrions";
import { AccountDetailsCarousel } from "../accounts/account-details-carousel";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Database } from "@/database.types";
import { getAccountBalances } from "../accounts/actions";
import AccountForm from "../accounts/account-form";
import { getCategories } from "../categories/actions";
import CategoryManage from "../categories/category-manage";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    username: string | null;
  } | null>(null);
  const [accountBalances, setAccountBalances] = useState<
    Database["public"]["Functions"]["get_account_balances"]["Returns"]
  >([]);
  const [categories, setCategories] = useState<
    Database["public"]["Functions"]["get_user_categories"]["Returns"]
  >([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const fetch = useCallback(async () => {
    try {
      if (!user) return;
      setLoading(true);

      const profile = await getProfile(user.id);
      const accounts = await getAccountBalances();
      const categories = await getCategories();

      setProfile(profile);

      setCategories(categories);
      setAccountBalances(accounts || []);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetch();
    } else {
      setLoading(false);
    }
  }, [user, fetch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <ThemeToggle className="fixed top-4 right-4 z-10" />

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">My options</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Customize your account and categories options
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Accounts</span>
              <div className="flex gap-2">
                <div className="w-20">
                  <AccountDetailsCarousel
                    accountBalances={accountBalances}
                    formatCurrency={formatCurrency}
                    label="Edit"
                  />
                </div>
                <AccountForm />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Categories</span>
              <div className="flex gap-2">
                <CategoryManage categories={categories} />
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
                {user?.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Username</span>
              <span className="text-sm text-muted-foreground">
                {profile?.username}
              </span>
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
