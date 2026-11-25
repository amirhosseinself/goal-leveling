"use client";

import { useState } from "react";
import axios from "axios";
import postSendOtp from "@/services/api/postSendOtp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ShieldCheck, Phone, ArrowLeft } from "lucide-react";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const handleSendOtp = async () => {
    setError(null);
    if (!phoneNumber.match(/^09\d{9}$/)) {
      setError("شماره موبایل معتبر ۱۱ رقمی وارد کنید (با 09).");
      return;
    }
    setLoading(true);
    const res = await postSendOtp({ phoneNumber });
    setLoading(false);
    if (res.status) setStep("otp");
    else setError(res.message || "ارسال کد ناموفق بود");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await axios.post("/api/auth/validate-otp", { phoneNumber, otpCode });
      setLoading(false);
      if (result?.data?.status === false) {
        setError(result?.data?.message || "کد یا شماره نامعتبر است");
        if (result?.data?.errors?.length) setError(result.data.errors.map((err: { message: string }) => err.message).join(", "));
      } else {
        window.location.href = "/dashboard/daily";
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error?.response?.data?.message || "خطا در ورود.");
        if (error?.response?.data?.errors?.length) setError(error.response.data.errors.map((err: { message: string }) => err.message).join(", "));
      } else setError("خطای غیرمنتظره رخ داد.");
    }
  };

  return (
    <div className="page-container min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.18),transparent_45%)] pointer-events-none" />
      <Card className="relative w-full max-w-md p-6 sm:p-8 glow-primary bg-card/75">
        <div className="text-center mb-8 space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
            {step === "phone" ? <Phone className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold">ورود به Goal Leveling</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {step === "phone" ? "شماره موبایل خود را وارد کن تا کد ورود دریافت کنی." : `کد ارسال‌شده به ${phoneNumber} را وارد کن.`}
            </p>
          </div>
        </div>

        {step === "phone" ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">شماره موبایل</Label>
              <Input id="phone-number" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="09xxxxxxxxx" className="ltr text-left" dir="ltr" />
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "در حال ارسال..." : "ارسال کد ورود"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="otp-code" className="block text-center">کد تایید</Label>
              <div className="flex justify-center" dir="ltr">
                <InputOTP maxLength={6} onChange={(value) => setOtpCode(value)}>
                  <InputOTPGroup className="ltr gap-2">
                    {[0,1,2,3,4,5].map((i) => <InputOTPSlot key={i} index={i} className="h-12 w-11 rounded-xl border-border/80 bg-background/50 text-lg" />)}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "در حال ورود..." : "ورود و شروع ماموریت"}
            </Button>
            <button type="button" onClick={() => { setStep("phone"); setError(null); setOtpCode(""); }} className="w-full text-sm text-muted-foreground hover:text-foreground transition flex items-center justify-center gap-1">
              تغییر شماره موبایل <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Login;
