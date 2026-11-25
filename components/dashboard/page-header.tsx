import Image from "next/image";
import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  backgroundImage?: string;
};

export function PageHeader({ eyebrow, title, description, actions, children, backgroundImage }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-8 backdrop-blur-sm">
      {backgroundImage ? (
        <>
          <Image src={backgroundImage} alt="" fill className="object-cover opacity-20" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-l from-card/50 via-card/70 to-card/90" />
        </>
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.08),transparent_40%)]" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          {eyebrow ? <div className="text-xs font-medium tracking-wide text-primary">{eyebrow}</div> : null}
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{title}</h1>
          {description ? <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children ? <div className="relative mt-6">{children}</div> : null}
    </div>
  );
}
