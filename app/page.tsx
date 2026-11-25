import Link from "next/link";
import { ArrowLeft, Target, Sparkles, Flame, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Target, title: "هدف‌گذاری شفاف", desc: "اهداف را با اولویت، ددلاین و مقدار قابل اندازه‌گیری تعریف کن." },
  { icon: Sparkles, title: "رشد مهارت", desc: "مهارت‌ها را به اهداف وصل کن و XP هر مهارت را جداگانه ببین." },
  { icon: Flame, title: "Streak و کوئست", desc: "با ماموریت‌های روزانه و streak، ریتم رشدت را حفظ کن." },
  { icon: Trophy, title: "Badge و Level", desc: "هر پیشرفت ثبت‌شده XP می‌دهد و دستاوردها را باز می‌کند." },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.22),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(244,63,94,0.08),transparent_35%)]" />
      <section className="page-container relative">
        <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[70vh]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" /> سیستم رشد شخصی گیمیفای‌شده
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15]">
              هدفت رو بزن.
              <span className="text-gradient block mt-2">Level Up کن.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-8">
              Goal Leveling یک داشبورد شخصی برای مدیریت هدف، مهارت، پیشرفت روزانه و گیمیفیکیشن است؛ جایی که هر اقدام کوچک تبدیل به XP، streak و پیشرفت واقعی می‌شود.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard/daily">ورود به ماموریت‌های امروز <ArrowLeft className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">مشاهده داشبورد</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
              {["ثبت پیشرفت روزانه", "XP و Level", "کوئست و Badge"].map((t) => (
                <div key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{t}</div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-l from-violet-500/20 to-cyan-500/10 blur-3xl rounded-full" />
            <Card className="relative p-6 sm:p-8 glow-primary bg-card/70">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-muted-foreground">پروفایل رشد</div>
                  <div className="text-2xl font-bold mt-1">Level 7</div>
                </div>
                <div className="rounded-2xl bg-primary/15 text-primary px-4 py-2 text-sm font-medium">2,450 XP</div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs text-muted-foreground"><span>تا Level بعدی</span><span>68%</span></div>
                <div className="h-3 rounded-full bg-muted overflow-hidden"><div className="h-full w-[68%] rounded-full bg-gradient-to-l from-violet-500 to-fuchsia-500" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[{ l: "Streak", v: "12 روز" }, { l: "کوئست", v: "4 فعال" }, { l: "Badge", v: "8 عدد" }].map((s) => (
                  <div key={s.l} className="rounded-xl border border-border/70 bg-background/40 p-3 text-center">
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                    <div className="font-bold mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {["ثبت پیشرفت هدف مطالعه", "تمرین مهارت TypeScript", "بازبینی هدف هفتگی"].map((t, i) => (
                  <div key={t} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/30 p-3">
                    <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${i === 0 ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "border-border"}`}>{i === 0 ? "✓" : ""}</div>
                    <div className={`text-sm ${i === 0 ? "line-through text-muted-foreground" : ""}`}>{t}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="p-5 bg-card/60 hover:bg-card/80 transition-colors">
                <div className="h-11 w-11 rounded-xl bg-primary/12 text-primary flex items-center justify-center mb-4"><Icon className="h-5 w-5" /></div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-7">{f.desc}</p>
              </Card>
            );
          })}
        </section>
      </section>
    </div>
  );
}
