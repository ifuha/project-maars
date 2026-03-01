"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPost } from "@/lib/api/post";
import { getCommentsByPost, createComment } from "@/lib/api/comment";
import {
  getTreesByPost,
  createTree,
  deleteTree,
  getTree,
} from "@/lib/api/tree";
import { Post, Comment } from "@/lib/api/type";
import { getUserId } from "@/lib/utils/access-token";
import Image from "next/image";
import { Tree } from "@/lib/api/type";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [treeCount, setTreeCount] = useState(0);
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [myTree, setMyTree] = useState<Tree | null>(null);

  useEffect(() => {
    const postId = Number(id);
    getPost(postId).then(setPost);
    getCommentsByPost(postId).then(setComments);
    getTreesByPost(postId).then((res) => setTreeCount(res.count));
  }, [id]);

  useEffect(() => {
    const currentUserId = getUserId();
    if (currentUserId) {
      getTree(currentUserId, Number(id)).then(setMyTree);
    }
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
      if (myTree) {
        await deleteTree(userId, Number(id));
        setMyTree(null);
        setTreeCount((prev) => Math.max(0, prev - 1));
      } else {
        const newTree = await createTree({ postId: Number(id), userId });
        setMyTree(newTree);
        setTreeCount((prev) => prev + 1);
      }
    } catch (e) {
      console.error("Error in handleTree:", e);
    }
  };

  if (!post)
    return (
      <div className="flex items-center justify-center">読み込み中...</div>
    );

  return (
    <div>
      <div className="ml-48 flex flex-col items-start p-8 gap-3">
        <div className="flex items-start gap-2">
          <div className="rounded-full overflow-hidden w-10 h-10 relative">
            <Image
              src={post.user.icon || "/rocket.svg"}
              alt={post.user.name}
              fill
              className="object-cover"
            />
          </div>
          <div>{post.user.name}</div>
        </div>

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

        <button
          onClick={handleTree}
          className="border border-orange-400 rounded-2xl px-4 py-2"
        >
          {treeCount}
        </button>
        <div className="text-xl font-bold">コメント</div>
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {userId && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="コメントを入力"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="border-b border-orange-400 p-2 flex-1 outline-none"
              />
              <button
                onClick={handleComment}
                className="bg-orange-400 text-white px-4 rounded-2xl hover:bg-white hover:text-orange-400 hover:shadow shadow-orange-400"
              >
                送信
              </button>
            </div>
          )}
          {comments.map((comment) => (
            <div
              key={comment.commentId}
              className="border-b border-orange-400 py-2"
            >
              <div className="flex items-center gap-4 py-4">
                <div className="rounded-full overflow-hidden w-10 h-10 relative">
                  <Image
                    src={comment.user?.icon || "/rocket.svg"}
                    alt="UserIcon"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>{comment.user?.name}</div>
              </div>
              <div>{comment.content}</div>
            </div>
          ))}
          {error && <p className="text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
