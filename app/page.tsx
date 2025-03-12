import Link from "next/link";

export default function Home() {
  return (
    <div className="container pt-16">
      <h1 className="text-5xl text-center"> levelup</h1>
      <Link href="/dashboard"> dashboard </Link>
    </div>
  );
}
