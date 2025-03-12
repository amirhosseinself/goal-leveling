import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/setting/ProfileSettings";
import AccountSettings from "@/components/setting/AccountSettings";
import SecuritySettings from "@/components/setting/SecuritySettings";

// صفحه اصلی تنظیمات با استفاده از Tabs
const SettingPage = () => {
  return (
    <div className="pt-16 container">
      <h1 className="text-2xl font-bold mb-8">تنظیمات کاربری</h1>
      <Tabs
        defaultValue="profile"
        className="w-full flex flex-col items-center"
      >
        <TabsList className="mb-4 rtl">
          <TabsTrigger value="profile">پروفایل</TabsTrigger>
          <TabsTrigger value="account">حساب</TabsTrigger>
          <TabsTrigger value="security">امنیت</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent className="w-full" value="account">
          <AccountSettings />
        </TabsContent>
        <TabsContent className="w-full" value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingPage;
