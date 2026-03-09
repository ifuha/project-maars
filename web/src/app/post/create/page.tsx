"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [tagSearch, setTagSearch] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()),
  );

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  const handleAddTag = async () => {
    if (!tagSearch) return;
    try {
      const tag = await createTag({ name: tagSearch });
      setTags([...tags, tag]);
      setSelectedTagIds([...selectedTagIds, tag.tagId]);
      setTagSearch("");
    } catch (e) {
      setError("タグの作成に失敗しました");
    }
  };

  const toggleTag = (tagId: number) => {
    console.log("toggleTag:", tagId);
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSubmit = async () => {
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
        selectedTagIds.map(async (tagId) => {
          console.log("createPostTag:", { postId: post.postId, tagId });
          return createPostTag({ postId: post.postId, tagId });
        }),
      );
      router.push("/");
    } catch (e) {
      setError("投稿に失敗しました");
    }
  };
  return (
    <div>
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
            <div className="relative w-100 h-50">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="preview"
                  width={400}
                  height={200}
                  className="object-cover rounded-2xl w-full h-full"
                />
              ) : (
                <div className="border border-orange-400 rounded-2xl w-full h-full flex items-center justify-center">
                  画像を選択
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="font-bold">{isPrivate ? "非公開" : "公開"}</div>
              <div
                onClick={() => setIsPrivate(!isPrivate)}
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                  isPrivate ? "bg-gray-400" : "bg-orange-400"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    isPrivate ? "translate-x-1" : "translate-x-7"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="タグを検索"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="border border-orange-400 rounded-2xl p-2"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-orange-400 text-white font-bold rounded-3xl px-6 py-2 hover:bg-white hover:text-orange-400 hover:shadow-xs shadow-orange-400"
              >
                タグを作成
              </button>
            </div>
            <div className="flex items-center gap-4">
              {tagSearch &&
                filteredTags.map((tag) => (
                  <button
                    key={tag.tagId}
                    onClick={() => {
                      toggleTag(tag.tagId);
                      setTagSearch("");
                    }}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      selectedTagIds.includes(tag.tagId)
                        ? "bg-orange-400 text-white"
                        : "border-orange-400"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
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
    </div>
  );
}

export default CreatePostPage;
