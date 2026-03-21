"use client";

import { useState, useEffect } from "react";
import { getPosts } from "@/lib/api/post";
import { getTags } from "@/lib/api/tag";
import { Post, Tag } from "@/lib/api/type";
import PostCard from "@/components/PostCard";

function ExplorePage() {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const newPost = posts.reverse();
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  useEffect(() => {
    getPosts(selectedTagId ?? undefined).then(setPosts);
  }, [selectedTagId]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="タグを検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-orange-400 rounded-2xl p-2 w-full"
          />
          {search &&
            filteredTags.map((tag) => (
              <button
                key={tag.tagId}
                onClick={() => {
                  setSelectedTagId(tag.tagId);
                  setSearch("");
                }}
                className={`px-3 py-1 rounded-full border text-sm ${
                  selectedTagId === tag.tagId
                    ? "bg-orange-400 text-white"
                    : "border-orange-400"
                }`}
              >
                <div className="text-nowrap">{tag.name}</div>
              </button>
            ))}
        </div>
        <div className="flex flex-col gap-4">
          {newPost.map((post) => (
            <div key={post.postId} className="py-2">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ExplorePage;
