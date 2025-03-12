import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AccountSettings = () => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">تنظیمات حساب</h2>
      <form className="space-y-4">
        <div>
          <Label htmlFor="email">ایمیل</Label>
          <Input id="email" type="email" placeholder="ایمیل خود را وارد کنید" />
        </div>
        <div>
          <Label htmlFor="phone">شماره تلفن</Label>
          <Input
            id="phone"
            type="text"
            placeholder="شماره تلفن خود را وارد کنید"
          />
        </div>
        <div>
          <Label htmlFor="password">رمز عبور</Label>
          <Input id="password" type="password" placeholder="رمز عبور جدید" />
        </div>
        <Button type="submit">ذخیره تغییرات</Button>
      </form>
    </Card>
  );
};

export default AccountSettings;
