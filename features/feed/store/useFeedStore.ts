import { create } from 'zustand';
import { Post } from '@/core/types';

interface FeedState {
  posts: Record<string, Post>;
  postIds: string[];
  isLoading: boolean;
  cursor: string | null;
  setFeedData: (newPosts: Post[], nextCursor: string | null) => void;
  toggleLikeOptimistic: (postId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useFeedStore = create<FeedState>()((set, get) => ({
  posts: {},
  postIds: [],
  isLoading: false,
  cursor: null,

  setFeedData: (newPosts, nextCursor) => {
    const currentPosts = get().posts;
    const currentIds = get().postIds;

    const mergedPosts = { ...currentPosts };
    const newIds = [...currentIds];

    for (const post of newPosts) {
      if (!mergedPosts[post.id]) {
        mergedPosts[post.id] = post;
        newIds.push(post.id);
      }
    }

    set({ posts: mergedPosts, postIds: newIds, cursor: nextCursor });
  },

  toggleLikeOptimistic: (postId) => {
    const post = get().posts[postId];
    if (!post) return;

    set({
      posts: {
        ...get().posts,
        [postId]: {
          ...post,
          hasLiked: !post.hasLiked,
          likesCount: post.hasLiked ? post.likesCount - 1 : post.likesCount + 1,
        },
      },
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
