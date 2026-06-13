import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 bg-zinc-50 px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-[2rem] bg-zinc-950 px-8 py-10 text-white">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-400">
            Next.js system design scaffold
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight">
            Storefront, checkout, and fleet tracking organized by route groups and features.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            The generated structure keeps reusable contracts in `core`, route entry points in
            `app`, and domain-specific UI and logic inside `features`.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              href: "/products",
              title: "Products",
              description: "SEO-focused catalog page prepared for a large product index.",
            },
            {
              href: "/checkout",
              title: "Checkout",
              description: "Multi-step checkout layout with room for validation and payment flows.",
            },
            {
              href: "/tracking",
              title: "Tracking",
              description: "Live operations dashboard for SSE-driven shipment updates.",
            },
            {
              href: "/fleet",
              title: "Fleet",
              description: "Fleet management overview with utilization and vehicle state cards.",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <p className="text-sm text-zinc-500">{item.href}</p>
              <h2 className="mt-3 text-2xl font-semibold text-zinc-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{item.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
