"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getUser } from "@/lib/api/user";
import { getPostsByUser } from "@/lib/api/post";
import { User, Post } from "@/lib/api/type";
import { getUserId } from "@/lib/utils/access-token";
import PostCard from "@/components/PostCard";
import Image from "next/image";

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const currentUserId = getUserId();

  useEffect(() => {
    const userId = Number(id);
    getUser(userId).then(setUser);
    getPostsByUser(userId).then(setPosts);
  }, [id]);

  if (!user) return <div>読み込み中...</div>;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* ヘッダー画像 */}
      {user.header && (
        <Image
          src={user.header}
          alt="header"
          width={1200}
          height={300}
          className="w-full object-cover h-48"
        />
      )}

      {/* ユーザー情報 */}
      <div className="flex flex-col items-center gap-2">
        <Image
          src={user.icon || "/rocket.svg"}
          alt={user.name}
          width={80}
          height={80}
          className="rounded-full border border-orange-400"
        />
        <h1 className="text-2xl font-bold">{user.name}</h1>
      </div>

      {/* 投稿一覧 */}
      <div className="grid grid-cols-3 gap-4 p-8 w-full">
        {posts.map((post) => (
          <div key={post.postId} className="relative">
            {post.isPrivate && (
              <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full z-10">
                非公開
              </span>
            )}
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
