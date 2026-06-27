"use client";

import Image from "next/image";
import { Gauge, Layers } from "lucide-react";

const codeStyles = "overflow-x-auto rounded-xl border border-slate-200 bg-[#0f172a] p-5 text-sm leading-relaxed text-slate-50";

function CodeBlock({ children }: { children: string }) {
  return (
    <div className={codeStyles}>
      <pre className="font-mono">{children}</pre>
    </div>
  );
}

function Section({
  id,
  title,
  description,
  code,
  codeFirst,
}: {
  id: string;
  title: string;
  description: string;
  code: string;
  codeFirst?: boolean;
}) {
  const content = (
    <>
      {codeFirst ? (
        <>
          <CodeBlock>{code}</CodeBlock>
          <div className="flex flex-col justify-start">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-start">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
          <CodeBlock>{code}</CodeBlock>
        </>
      )}
    </>
  );

  return (
    <section id={id} className="scroll-mt-20">
      <div className="grid gap-8 lg:grid-cols-2">{content}</div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              V
            </div>
            <span className="text-sm font-semibold text-slate-900">Virtualized rendering</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
            <a href="#problem" className="hover:text-slate-900">Problem</a>
            <a href="#solution" className="hover:text-slate-900">Solution</a>
            <a href="#implementation" className="hover:text-slate-900">Implementation</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
            <Gauge className="size-4" />
            Performance pattern
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Virtualized rendering at scale
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            How the products page renders 100,000 items with minimal DOM nodes using
            windowed rendering via react-virtuoso.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Gauge className="size-5 text-green-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">100k items</div>
              <div className="mt-0.5 text-xs text-slate-500">Full dataset in memory</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Layers className="size-5 text-blue-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Windowed DOM</div>
              <div className="mt-0.5 text-xs text-slate-500">Only visible rows mounted</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Gauge className="size-5 text-amber-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">60fps scrolling</div>
              <div className="mt-0.5 text-xs text-slate-500">No layout thrashing</div>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          <Section
            id="problem"
            title="The problem: 100,000 DOM nodes"
            description="Rendering a list of 100,000 items as actual DOM elements would consume gigabytes of memory, freeze the main thread during mount, and make scrolling unusable. The browser's layout engine would struggle to manage the style recalculation and painting for that many nodes."
            code={`// Every item creates real DOM nodes
// 100,000 items = 100,000+ DOM nodes
<div class="grid grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard product={product} />
    // Each card contains ~20 DOM nodes
    // Total: ~2,000,000 DOM nodes
  ))}
</div>

// Result:
// - 2+ seconds initial render
// - 500+ MB memory
// - Single-digit FPS on scroll
// - Frequent browser tab crashes`}
            codeFirst={true}
          />

          <section id="solution" className="scroll-mt-20">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col justify-start">
                <h3 className="text-lg font-semibold text-slate-900">The solution: windowed rendering</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Virtualization (windowed rendering) only mounts the items visible in the viewport plus a small overscan buffer. As the user scrolls, exiting nodes are unmounted and new ones are mounted in their place — recycling DOM elements instead of creating new ones. The total DOM stays constant regardless of list size.
                </p>
              </div>
              <Image
                src="/virtualize.png"
                alt="Virtualized rendering diagram showing viewport window"
                width={600}
                height={400}
                className="w-full rounded-xl border border-slate-200"
              />
            </div>
          </section>

          <Section
            id="implementation"
            title="Implementation with VirtuosoGrid"
            description="The products page uses react-virtuoso's VirtuosoGrid component, which accepts the same data array and renders items through an itemContent render prop. The listClassName prop applies a responsive grid layout. useWindowScroll makes the entire page the scroll container. The result: 100,000 products rendered with the same performance as 20."
            code={`import { VirtuosoGrid } from 'react-virtuoso';

export default function ProductsPage() {
  const mockProducts = useMemo(() => {
    return Array.from({ length: 100000 }).map(
      (_, index) => ({
        id: \`prod-\${index + 1}\`,
        title: \`Advanced Commerce Product \${index + 1}\`,
        price: 100 + (index % 900),
        category: index % 2 === 0
          ? 'Logistics'
          : 'E-commerce',
      })
    );
  }, []);

  return (
    <VirtuosoGrid
      useWindowScroll
      data={mockProducts}
      listClassName={\`
        grid grid-cols-1 sm:grid-cols-2
        md:grid-cols-3 lg:grid-cols-4 gap-6
      \`}
      itemContent={(index, product) => (
        <ProductCard product={product} />
      )}
    />
  );
}

// Key props:
// - useWindowScroll: uses the page scroll,
//   not a container scroll
// - data: full array (100k items)
// - listClassName: CSS grid for responsive layout
// - itemContent: renders only visible items`}
            codeFirst={true}
          />
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          Built with react-virtuoso, Next.js, and Tailwind CSS.
        </footer>
      </div>
    </main>
  );
}
