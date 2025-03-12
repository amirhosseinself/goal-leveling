import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ProfileSettings = () => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">تنظیمات پروفایل</h2>
      <form className="space-y-4">
        <div>
          <Label htmlFor="username">نام کاربری</Label>
          <Input
            id="username"
            type="text"
            placeholder="نام کاربری خود را وارد کنید"
          />
        </div>
        <div>
          <Label htmlFor="fullname">نام کامل</Label>
          <Input
            id="fullname"
            type="text"
            placeholder="نام کامل خود را وارد کنید"
          />
        </div>
        <div>
          <Label htmlFor="bio">بیوگرافی</Label>
          <Input id="bio" type="text" placeholder="درباره خود بنویسید" />
        </div>
        <Button type="submit">ذخیره تغییرات</Button>
      </form>
    </Card>
  );
};
export default ProfileSettings;
