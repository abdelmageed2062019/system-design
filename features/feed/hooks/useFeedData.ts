'use client';

import { useEffect, useCallback } from 'react';
import { useFeedStore } from '../store/useFeedStore';

export function useFeedData() {
     const { postIds, posts, isLoading, setFeedData, setLoading } = useFeedStore();

     const fetchNextPage = useCallback(async () => {
          if (isLoading) return;
          setLoading(true);

          try {
               const response = await fetch('/data.json');
               if (!response.ok) throw new Error('Feed fetch failed');
               const data = await response.json();
               setFeedData(data.posts, null);
          } catch (err) {
               console.error('Feed fetch failed:', err);
          } finally {
               setLoading(false);
          }
     }, [isLoading, setFeedData, setLoading]);

     useEffect(() => {
          if (postIds.length === 0) fetchNextPage();
     }, []);

     return {
          postIds,
          posts,
          isLoading,
          loadMore: fetchNextPage
     };
}