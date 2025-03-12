"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import getUserInfo from "@/services/api/getUserInfo";
import postUpdateUserInfo from "@/services/api/postUpdateUserInfo";
import toast from "react-hot-toast";

// تعریف تایپ برای state کامپوننت
interface Profile {
  username: string;
  fullname: string;
  bio: string;
}

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    username: "",
    fullname: "",
    bio: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // دریافت اطلاعات پروفایل هنگام بارگذاری کامپوننت
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getUserInfo();
        console.log("[fetchProfile] Response:", response);

        if (response.status) {
          const userData = response.data;
          setProfile({
            username: userData.userName || "",
            fullname: userData.fullName || "",
            bio: userData.bio || "",
          });
        } else {
          console.error("Error fetching profile:", response.message);
          toast.error(response.message || "خطا در دریافت اطلاعات کاربری");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("خطا در دریافت اطلاعات کاربری");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await postUpdateUserInfo({
        updatingData: {
          userName: profile.username,
          fullName: profile.fullname,
          bio: profile.bio,
        },
      });
      if (response.status) {
        toast.success("اطلاعات کاربری با موفقیت به‌روزرسانی شد");
        const updatedUser = response.data;
        setProfile({
          username: updatedUser.userName || "",
          fullname: updatedUser.fullName || "",
          bio: updatedUser.bio || "",
        });
      } else {
        toast.error(response.message || "خطا در به‌روزرسانی اطلاعات کاربری");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("خطا در به‌روزرسانی اطلاعات کاربری");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">تنظیمات پروفایل</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">نام کاربری</Label>
          <Input
            id="username"
            type="text"
            className="placeholder:text-right mt-2"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
            placeholder="نام کاربری خود را وارد کنید"
          />
        </div>
        <div>
          <Label htmlFor="fullname">نام کامل</Label>
          <Input
            id="fullname"
            type="text"
            className="placeholder:text-right mt-2"
            value={profile.fullname}
            onChange={(e) =>
              setProfile({ ...profile, fullname: e.target.value })
            }
            placeholder="نام کامل خود را وارد کنید"
          />
        </div>
        <div>
          <Label htmlFor="bio">بیوگرافی</Label>
          <Input
            id="bio"
            type="text"
            className="placeholder:text-right mt-2"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="درباره خود بنویسید"
          />
        </div>
        <Button disabled={loading} type="submit">
          ذخیره تغییرات
        </Button>
      </form>
    </Card>
  );
};

export default ProfileSettings;
