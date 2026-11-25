import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/setting/ProfileSettings";
import AccountSettings from "@/components/setting/AccountSettings";
import SecuritySettings from "@/components/setting/SecuritySettings";
import { PageHeader } from "@/components/dashboard/page-header";

const SettingPage = () => {
  return (
    <div className="page-container space-y-6">
      <PageHeader eyebrow="تنظیمات" title="تنظیمات کاربری" description="اطلاعات حساب، پروفایل و امنیت خود را مدیریت کن." />
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 bg-card/60 border border-border/70 p-1 h-auto rounded-2xl">
          <TabsTrigger value="profile" className="rounded-xl px-4 py-2">پروفایل</TabsTrigger>
          <TabsTrigger value="account" className="rounded-xl px-4 py-2">حساب</TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-4 py-2">امنیت</TabsTrigger>
        </TabsList>
        <TabsContent value="profile"><ProfileSettings /></TabsContent>
        <TabsContent value="account"><AccountSettings /></TabsContent>
        <TabsContent value="security"><SecuritySettings /></TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingPage;
