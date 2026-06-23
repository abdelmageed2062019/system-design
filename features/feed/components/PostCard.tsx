'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Post } from '../../../core/types';
import { useFeedStore } from '../store/useFeedStore';
import { Heart } from 'lucide-react';

export const PostCard = memo(function PostCard({ post }: { post: Post }) {
     const toggleLikeOptimistic = useFeedStore((state) => state.toggleLikeOptimistic);

     const handleLike = () => {
          toggleLikeOptimistic(post.id);
     };

     return (
          <div className="bg-white border max-w-2xl mx-auto border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col w-full mb-4">
               <div className="flex items-center gap-3 mb-3">
                    <Image src={post.avatarUrl} alt={post.username} width={32} height={32} className="w-6 h-6 rounded-full bg-slate-100" />
                    <span className="font-bold text-xs text-slate-800">{post.username}</span>
               </div>

               <div className="w-full aspect-square bg-slate-900 rounded-2xl overflow-hidden relative">
                    <Image src={post.mediaUrl} alt="Instagram Content" fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
               </div>

               <div className="pt-3">
                    <div className="flex items-center gap-2 mb-1">
                         <button onClick={handleLike} className={`transition-transform active:scale-125 ${post.hasLiked ? 'text-rose-500' : 'text-slate-700'}`}>
                              <Heart size={20} fill={post.hasLiked ? 'currentColor' : 'none'} />
                         </button>
                         <span className="text-xs font-mono font-bold text-slate-800">{post.likesCount} إعجاب</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed break-words">{post.caption}</p>
               </div>
          </div>
     );
});