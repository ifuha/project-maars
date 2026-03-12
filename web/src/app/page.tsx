"use client";

import { getPosts } from "@/lib/api/post";
import PostCard from "@/components/PostCard";
import { Post } from "@/lib/api/type";
import { useEffect, useState } from "react";
import MarsWeather from "@/components/marsWeather";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then((data) => setPosts(data.reverse()))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex md:ml-64 min-h-screen mb-16 md:mb-0">
      <div className="flex-1 flex flex-col p-4 md:p-8 gap-12">
        <div className="text-xl font-black border-b border-orange-400 py-4">
          Home
        </div>
        <div className="flex flex-col gap-2">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-32 bg-gray-100 animate-pulse rounded-2xl py-2"
                />
              ))
            : posts.map((post) => (
                <div key={post.postId} className="py-2">
                  <PostCard
                    post={post}
                    onDelete={(id) =>
                      setPosts((prev) => prev.filter((p) => p.postId !== id))
                    }
                  />
                </div>
              ))}
        </div>
      </div>

      <div className="hidden md:block w-80 relative">
        <div className="fixed top-8 right-8 w-72">
          <MarsWeather />
        </div>
      </div>
    </div>
  );
}
