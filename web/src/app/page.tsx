"use client";

import { getPosts } from "@/lib/api/post";
import PostCard from "@/components/PostCard";
import { Post } from "@/lib/api/type";
import { useEffect, useState } from "react";
import MarsWeather from "@/components/marsWeather";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);
  return (
    <div className="flex justify-end">
      <div className="flex-1 flex flex-col items-center">
        <div className="border-r border-orange-100 border-l p-4">
          {posts.map((post) => (
            <div key={post.postId} className="py-2">
              <div className="hover:bg-orange-50 p-4 rounded-2xl">
                <PostCard post={post} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed">
        <MarsWeather />
      </div>
    </div>
  );
}
