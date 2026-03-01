"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getUser } from "@/lib/api/user";
import { getPostsByUser } from "@/lib/api/post";
import { User, Post } from "@/lib/api/type";
import { getUserId } from "@/lib/utils/access-token";
import PostCard from "@/components/PostCard";
import Image from "next/image";
import SideBar from "@/components/sidebar";

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

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        読み込み中...
      </div>
    );

  return (
    <div>
      <div className="flex flex-col items-center gap-8">
        <div className="border-r border-l border-orange-100 p-4 min-h-screen">
          <div className="py-4">
            {user.header && (
              <Image
                src={user.header}
                alt="header"
                width={600}
                height={300}
                className="w-full object-cover h-48 rounded-2xl"
              />
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full overflow-hidden w-10 h-10">
              <Image
                src={user.icon || "/rocket.svg"}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full object-cover w-full h-full border border-orange-400"
              />
            </div>
            <div className="text-2xl font-bold">{user.name}</div>
          </div>
          <div className="py-8" />
          <div className="flex flex-col items-center justify-center gap-4">
            {posts.map((post) => (
              <div key={post.postId} className="relative">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
