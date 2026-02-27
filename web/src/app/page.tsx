"use client";

import { getPosts } from "@/lib/api/post";
import PostCard from "@/components/PostCard";
import { Post } from "@/lib/api/type";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
}
