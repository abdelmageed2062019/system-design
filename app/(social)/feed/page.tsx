'use client'

import { Virtuoso } from 'react-virtuoso';
import { useFeedData } from '@/features/feed/hooks/useFeedData';
import { PostCard } from '@/features/feed/components/PostCard';
import { Loader2 } from 'lucide-react';

export default function FeedPage() {
     const { postIds, posts, isLoading, loadMore } = useFeedData();

     return (
          <div className="w-full  h-screen">
               <Virtuoso
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