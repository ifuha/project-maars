"use client";

import { useState, useEffect } from "react";
import { getTopics } from "@/lib/api/topic";
import { getPost } from "@/lib/api/post";
import { Post } from "@/lib/api/type";
import PostCard from "@/components/PostCard";

export default function TopicPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getTopics().then(async (topics) => {
      const postPromises = topics.map((t) => getPost(t.postId));
      const posts = await Promise.all(postPromises);
      setPosts(posts);
    });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="text-2xl font-bold text-orange-400">Topic</div>
          {posts.map((post, index) => (
            <div key={post.postId}>
              <div className="text-2xl text-orange-400 py-2 my-4 border-b border-orange-400">
                {index + 1}
              </div>
              <div className="flex items-center">
                <PostCard post={post} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
