"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPost } from "@/lib/api/post";
import {
  getCommentsByPost,
  createComment,
  deleteComment,
} from "@/lib/api/comment";
import { getTreesByPost, createTree, deleteTree } from "@/lib/api/tree";
import { Post, Comment } from "@/lib/api/type";
import { getUserId } from "@/lib/utils/access-token";
import Image from "next/image";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [treeCount, setTreeCount] = useState(0);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState("");
  const userId = getUserId();

  useEffect(() => {
    const postId = Number(id);
    getPost(postId).then(setPost);
    getCommentsByPost(postId).then(setComments);
    getTreesByPost(postId).then((res) => setTreeCount(res.count));
  }, [id]);

  const handleComment = async () => {
    if (!commentContent || !userId) return;
    try {
      const comment = await createComment({
        postId: Number(id),
        userId,
        content: commentContent,
      });
      setComments([...comments, comment]);
      setCommentContent("");
    } catch (e) {
      setError("コメントに失敗しました");
    }
  };

  const handleTree = async () => {
    if (!userId) return;
    try {
      await createTree({ postId: Number(id), userId });
      setTreeCount(treeCount + 1);
    } catch (e) {
      setError("いいねに失敗しました");
    }
  };

  if (!post) return <div>読み込み中...</div>;

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {/* ユーザー情報 */}
      <div className="flex items-center gap-2">
        <Image
          src={post.user.icon || "/rocket.svg"}
          alt={post.user.name}
          width={40}
          height={40}
          className="rounded-full border border-orange-400"
        />
        <span>{post.user.name}</span>
      </div>

      {/* 投稿内容 */}
      <h1 className="text-2xl font-bold">{post.title}</h1>
      {post.thumbnail && (
        <Image
          src={post.thumbnail}
          alt={post.title}
          width={600}
          height={400}
          className="object-cover rounded-2xl"
        />
      )}
      <p className="w-full max-w-2xl">{post.content}</p>

      {/* タグ */}
      <div className="flex gap-2">
        {post.postTags.map((pt) => (
          <span
            key={pt.tagId}
            className="px-3 py-1 rounded-full border border-orange-400 text-sm"
          >
            {pt.tag.name}
          </span>
        ))}
      </div>

      {/* いいね */}
      <button
        onClick={handleTree}
        className="border border-orange-400 rounded-2xl px-4 py-2"
      >
        🌳 {treeCount}
      </button>

      {/* コメント */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <h2 className="text-xl font-bold">コメント</h2>
        {comments.map((comment) => (
          <div key={comment.commentId} className="border rounded-2xl p-4">
            <p>{comment.content}</p>
          </div>
        ))}
        {userId && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="コメントを入力"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="border border-orange-400 rounded-2xl p-2 flex-1"
            />
            <button
              onClick={handleComment}
              className="border border-orange-400 rounded-2xl px-4"
            >
              送信
            </button>
          </div>
        )}
        {error && <p className="text-red-400">{error}</p>}
      </div>
    </div>
  );
}
