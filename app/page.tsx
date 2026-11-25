import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Target, Sparkles, Flame, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Target, title: "هدف‌گذاری شفاف", desc: "اهداف را با اولویت، ددلاین و مقدار قابل اندازه‌گیری تعریف کن." },
  { icon: Sparkles, title: "رشد مهارت", desc: "مهارت‌ها را به اهداف وصل کن و XP هر مهارت را جداگانه ببین." },
  { icon: Flame, title: "Streak و کوئست", desc: "با ماموریت‌های روزانه و streak، ریتم رشدت را حفظ کن." },
  { icon: Trophy, title: "Badge و Level", desc: "هر پیشرفت ثبت‌شده XP می‌دهد و دستاوردها را باز می‌کند." },
];

const gallery = [
  { src: "/images/hero-climb.jpg", alt: "کوهنورد در مسیر صعود - نماد تلاش", label: "تلاش مداوم" },
  { src: "/images/goal-peak.jpg", alt: "قله کوه در آسمان تاریک - نماد هدف", label: "رسیدن به قله" },
  { src: "/images/anime-night.jpg", alt: "شب نئونی شهر - الهام انیمه‌ای", label: "انرژی و تمرکز" },
  { src: "/images/city-ambition.jpg", alt: "نمای شبانه شهر - نماد جاه‌طلبی", label: "جاه‌طلبی بزرگ" },
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
            <Card className="relative overflow-hidden p-0 glow-primary bg-card/70">
              <div className="relative h-52 sm:h-60">
                <Image src="/images/hero-climb.jpg" alt="کوهنورد در حال صعود به قله" fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-xs text-white/70">مسیر امروز</div>
                    <div className="text-xl font-bold text-white">هر قدم، یک Level جدید</div>
                  </div>
                  <div className="rounded-2xl bg-primary/85 text-white px-4 py-2 text-sm font-medium backdrop-blur-sm">2,450 XP</div>
                </div>
              </div>
              <div className="p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">پروفایل رشد</div>
                    <div className="text-2xl font-bold mt-1">Level 7</div>
                  </div>
                  <div className="text-sm text-muted-foreground">تا Level بعدی: 68%</div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 rounded-full bg-muted overflow-hidden"><div className="h-full w-[68%] rounded-full bg-gradient-to-l from-violet-500 to-fuchsia-500" /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ l: "Streak", v: "12 روز" }, { l: "کوئست", v: "4 فعال" }, { l: "Badge", v: "8 عدد" }].map((s) => (
                    <div key={s.l} className="rounded-xl border border-border/70 bg-background/40 p-3 text-center">
                      <div className="text-xs text-muted-foreground">{s.l}</div>
                      <div className="font-bold mt-1">{s.v}</div>
                    </div>
                  ))}
                </div>
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

        <section className="mt-12 space-y-5">
          <div className="text-center space-y-2">
            <div className="text-xs font-medium tracking-wide text-primary">الهام مسیر رشد</div>
            <h2 className="text-2xl sm:text-3xl font-bold">از تلاش تا فتح قله</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-7">هر هدف یک مسیر است؛ با ریتم روزانه، تمرکز و پیشرفت کوچک، به قله می‌رسی.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {gallery.map((img) => (
              <div key={img.src} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 aspect-[4/5]">
                <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 right-0 left-0 p-4">
                  <div className="text-sm font-semibold text-white">{img.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
