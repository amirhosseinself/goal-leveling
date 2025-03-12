import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SecuritySettings = () => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">تنظیمات امنیت</h2>
      <form className="space-y-4">
        <div>
          <Label htmlFor="otp">تنظیمات OTP</Label>
          <Input id="otp" type="text" placeholder="فعال/غیرفعال" disabled />
        </div>
        <Button type="submit">به‌روزرسانی</Button>
      </form>
    </Card>
  );
};

export default SecuritySettings;
