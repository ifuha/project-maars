"use client";

import { useState, useEffect } from "react";
import { createPost } from "@/lib/api/post";
import { createTag, getTags } from "@/lib/api/tag";
import { createPostTag } from "@/lib/api/postTag";
import { useRouter } from "next/navigation";
import { Tag } from "@/lib/api/type";
import { getUserId } from "@/lib/utils/access-token";
import { uploadFile } from "@/lib/api/upLoad";

function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  const handleAddTag = async () => {
    if (!newTagName) return;
    try {
      const tag = await createTag({ name: newTagName });
      setTags([...tags, tag]);
      setSelectedTagIds([...selectedTagIds, tag.tagId]);
      setNewTagName("");
    } catch (e) {
      setError("タグの作成に失敗しました");
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    const userId = getUserId();
    try {
      if (!userId) {
        setError("ログインが必要です");
        return;
      }
      let thumbnailUrl = "";
      if (thumbnailFile) {
        thumbnailUrl = await uploadFile(thumbnailFile);
      }
      const post = await createPost({
        title,
        content,
        thumbnail: thumbnailUrl,
        isPrivate,
        userId,
      });
      await Promise.all(
        selectedTagIds.map((tagId) =>
          createPostTag({ postId: post.postId, tagId }),
        ),
      );
      router.push("/");
    } catch (e) {
      setError("投稿に失敗しました");
    }
  };
  return (
    <div className="flex justify-center">
      <div className="flex justify-between items-center h-svh gap-35">
        <div className="flex flex-col items-center justify-end gap-4">
          <input
            type="text"
            placeholder="タイトル"
            onChange={(e) => setTitle(e.target.value)}
            className="border border-orange-400 rounded-2xl p-2"
          />
          <textarea
            onChange={(e) => setContent(e.target.value)}
            className="border border-orange-400 w-100 h-100 rounded-2xl p-2"
          />
        </div>
        <div className="flex flex-col items-center justify-end gap-12">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            className="border border-orange-400 rounded-2xl w-100 h-50 p-4"
          />
          <label>
            公開/非公開
            <input
              type="checkbox"
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="border border-orange-400 rounded-2xl p-2"
            />
          </label>
          <div className="flex items-center justify-center gap-2">
            {tags.map((tag) => (
              <button key={tag.tagId} onClick={() => toggleTag(tag.tagId)}>
                {tag.name}
              </button>
            ))}
            <input
              type="text"
              placeholder="新規タグ名"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="border border-orange-400 rounded-2xl p-2"
            />
            <button
              onClick={handleAddTag}
              className="border border-orange-400 rounded-2xl p-2"
            >
              追加
            </button>
          </div>
          <button
            onClick={handleSubmit}
            className="border border-orange-400 rounded-2xl p-2"
          >
            投稿する
          </button>
          {error && <div className="text-red-400">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default CreatePostPage;
