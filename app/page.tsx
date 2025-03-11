import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-5xl">hello world!</h1>
      <Link href="/dashboard"> dashboard </Link>
    </div>
  );
}
