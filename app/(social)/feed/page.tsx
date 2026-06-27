'use client'

import Link from 'next/link';
import { Virtuoso } from 'react-virtuoso';
import { useFeedData } from '@/features/feed/hooks/useFeedData';
import { PostCard } from '@/features/feed/components/PostCard';
import { Loader2, Rss } from 'lucide-react';

export default function FeedPage() {
     const { postIds, posts, isLoading, loadMore } = useFeedData();

     return (
          <div className="w-full h-screen flex flex-col">
               <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
                    <div className="mx-auto flex max-w-2xl items-center justify-between">
                         <div className="flex items-center gap-3">
                              <Rss className="size-5 text-rose-500" />
                              <h1 className="text-lg font-bold text-slate-900">Feed</h1>
                         </div>
                         <Link
                              href="/feed/docs"
                              className="text-xs font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
                         >
                              Docs
                         </Link>
                    </div>
               </header>
               <Virtuoso
                    className="flex-1"
                    data={postIds}
                    style={{ height: '100%' }}
                    increaseViewportBy={400}
                    endReached={loadMore}
                    itemContent={(_, id) => <PostCard post={posts[id]} />}
                    components={{
                         Footer: () => isLoading ? (
                              <div className="py-4 flex justify-center w-full">
                                   <Loader2 className="animate-spin text-blue-600" size={20} />
                              </div>
                         ) : null
                    }}
               />
          </div>
     );
}