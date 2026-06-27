"use client";

import { Rss, Infinity, Zap, Heart } from "lucide-react";

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
            <div className="flex size-8 items-center justify-center rounded-lg bg-rose-600 text-xs font-bold text-white">
              F
            </div>
            <span className="text-sm font-semibold text-slate-900">Infinite feed</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
            <a href="#virtual-scroll" className="hover:text-slate-900">Virtual Scroll</a>
            <a href="#zustand-store" className="hover:text-slate-900">Store</a>
            <a href="#optimistic-likes" className="hover:text-slate-900">Optimistic Likes</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-rose-600">
            <Rss className="size-4" />
            Social feed pattern
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Infinite-scroll social feed
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            How the feed page renders a virtualized list of posts with infinite scroll,
            Zustand-based deduplication, and optimistic like toggling.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Infinity className="size-5 text-blue-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Infinite scroll</div>
              <div className="mt-0.5 text-xs text-slate-500">Virtuoso with endReached</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Zap className="size-5 text-green-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Deduplication</div>
              <div className="mt-0.5 text-xs text-slate-500">Zustand merges by post ID</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Heart className="size-5 text-rose-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Optimistic likes</div>
              <div className="mt-0.5 text-xs text-slate-500">Instant UI update, no server wait</div>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          <Section
            id="virtual-scroll"
            title="Virtualized infinite scroll with Virtuoso"
            description="The feed uses react-virtuoso's list component with endReached to trigger pagination. Only visible posts are mounted in the DOM. The increaseViewportBy={400} prop renders an extra 400px buffer above and below the viewport so fast scrolling doesn't show blank space. Virtuoso is used in list mode (not grid) with the entire page as the scroll container."
            code={`import { Virtuoso } from 'react-virtuoso';

export default function FeedPage() {
  const { postIds, posts, isLoading, loadMore } =
    useFeedData();

  return (
    <Virtuoso
      data={postIds}
      style={{ height: '100%' }}
      increaseViewportBy={400}
      endReached={loadMore}
      itemContent={(_, id) => (
        <PostCard post={posts[id]} />
      )}
      components={{
        Footer: () => isLoading ? (
          <Loader2 className="animate-spin ..." />
        ) : null,
      }}
    />
  );
}

// Key props:
// - data: array of post IDs (not full objects)
// - endReached: fires when near bottom
// - increaseViewportBy: overscan buffer
// - itemContent: renders only visible items
// - components.Footer: loading spinner at bottom`}
            codeFirst={true}
          />

          <Section
            id="zustand-store"
            title="Zustand store with deduplication"
            description="Posts are stored in a normalized Record<string, Post> keyed by ID, with a separate postIds array for ordering. When new data arrives, setFeedData iterates over the incoming posts and only appends IDs that don't already exist in the map. This prevents duplicates across pagination boundaries. The cursor field is kept for future cursor-based API integration."
            code={`interface FeedState {
  posts: Record<string, Post>;  // normalized by ID
  postIds: string[];            // ordered list
  isLoading: boolean;
  cursor: string | null;
}

setFeedData: (newPosts, nextCursor) => {
  const currentPosts = get().posts;
  const currentIds = get().postIds;

  const mergedPosts = { ...currentPosts };
  const newIds = [...currentIds];

  for (const post of newPosts) {
    // Only add if not already present
    if (!mergedPosts[post.id]) {
      mergedPosts[post.id] = post;
      newIds.push(post.id);
    }
  }

  set({
    posts: mergedPosts,
    postIds: newIds,
    cursor: nextCursor,
  });
};

// In useFeedData:
const fetchNextPage = useCallback(async () => {
  if (isLoading) return;
  setLoading(true);
  const res = await fetch('/data.json');
  const data = await res.json();
  setFeedData(data.posts, null);
  setLoading(false);
}, [isLoading, setFeedData, setLoading]);`}
            codeFirst={false}
          />

          <Section
            id="optimistic-likes"
            title="Optimistic like toggling"
            description="When the user clicks the heart icon, toggleLikeOptimistic flips hasLiked and adjusts likesCount immediately in Zustand — no server round-trip. The PostCard is wrapped in React.memo so it only re-renders when its specific post data changes. The heart icon uses fill={currentColor} for a filled/outline toggle with a scale animation on click."
            code={`// Store: instant toggle, no fetch
toggleLikeOptimistic: (postId) => {
  const post = get().posts[postId];
  if (!post) return;

  set({
    posts: {
      ...get().posts,
      [postId]: {
        ...post,
        hasLiked: !post.hasLiked,
        likesCount: post.hasLiked
          ? post.likesCount - 1
          : post.likesCount + 1,
      },
    },
  });
};

// PostCard: memoized to prevent re-renders
// when other posts change
export const PostCard = memo(function PostCard(
  { post }: { post: Post }
) {
  const toggleLikeOptimistic =
    useFeedStore((s) => s.toggleLikeOptimistic);

  return (
    <div className="bg-white border ...">
      <button onClick={() => toggleLikeOptimistic(post.id)}
        className={post.hasLiked
          ? 'text-rose-500'
          : 'text-slate-700'}>
        <Heart size={20}
          fill={post.hasLiked ? 'currentColor' : 'none'} />
      </button>
      <span>{post.likesCount} likes</span>
    </div>
  );
});`}
            codeFirst={false}
          />

          <Section
            id="postcard-patterns"
            title="PostCard: avatar, media, and memo"
            description="The PostCard uses Next.js Image with fill and aspect-square for a 1:1 media container. The avatar is a small 32x32 rounded image. The component is wrapped in React.memo to prevent unnecessary re-renders when new posts are added to the feed — only the post whose data actually changed re-renders."
            code={`export const PostCard = memo(function PostCard(
  { post }: { post: Post }
) {
  const toggleLikeOptimistic =
    useFeedStore((s) => s.toggleLikeOptimistic);

  return (
    <div className="bg-white border max-w-2xl mx-auto
      rounded-3xl p-4 shadow-sm mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Image src={post.avatarUrl} alt={post.username}
          width={32} height={32}
          className="w-6 h-6 rounded-full" />
        <span className="font-bold text-xs">
          {post.username}
        </span>
      </div>

      {/* Media */}
      <div className="w-full aspect-square
        bg-slate-900 rounded-2xl overflow-hidden relative">
        <Image src={post.mediaUrl} alt="Post media"
          fill className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px" />
      </div>

      {/* Actions */}
      <div className="pt-3">
        <button onClick={handleLike}
          className="transition-transform active:scale-125">
          <Heart size={20}
            fill={post.hasLiked ? 'currentColor' : 'none'} />
        </button>
        <span className="text-xs font-bold">
          {post.likesCount} likes
        </span>
        <p className="text-xs text-slate-600">
          {post.caption}
        </p>
      </div>
    </div>
  );
});`}
            codeFirst={true}
          />
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          Built with react-virtuoso, Zustand 5, and Next.js Image.
        </footer>
      </div>
    </main>
  );
}
