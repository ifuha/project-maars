"use client";

import { Post, Tree } from "@/lib/api/type";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUserId } from "@/lib/utils/access-token";
import {
  getTreesByPost,
  createTree,
  deleteTree,
  getTree,
} from "@/lib/api/tree";
import { cn } from "@/lib/utils/cn";
import LinkCard from "./LinkCard";
import { deletePost } from "@/lib/api/post";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const [treeCount, setTreeCount] = useState(0);
  const [myTree, setMyTree] = useState<Tree | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const extractUrl = (text: string): string | null => {
    const match = text.match(/https?:\/\/[^\s]+/);
    return match?.[0] || null;
  };

  useEffect(() => {
    const currentUserId = getUserId();
    setUserId(currentUserId);

    getTreesByPost(post.postId).then((res) => setTreeCount(res.count));

    if (currentUserId) {
      getTree(currentUserId, post.postId).then(setMyTree);
    }
  }, [post.postId]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("delete!")) return;
    try {
      await deletePost(post.postId);
    } catch (error) {
      return;
    }
  };

  const handleTree = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;

    try {
      if (myTree) {
        const treeId = (myTree as any).treeId || (myTree as any).TreeId;
        await deleteTree(treeId);
        setMyTree(null);
        setTreeCount((prev) => Math.max(0, prev - 1));
      } else {
        const newTree = await createTree({ postId: post.postId, userId });
        setMyTree(newTree);
        setTreeCount((prev) => prev + 1);
      }
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  return (
    <div className="border-b border-orange-400">
      <div className="flex flex-col items-start justify-start gap-4 rounded-2xl">
        <div className="flex justify-between w-full">
          <Link href={`/user/${post.user.userId}`}>
            <div className="flex items-center justify-center">
              <div className="me-4">
                <div className="rounded-full overflow-hidden w-10 h-10">
                  <Image
                    src={post.user.icon || "/rocket.svg"}
                    alt={post.user.name}
                    width={32}
                    height={32}
                    className="rounded-full overflow-hidden w-full h-full border border-orange-400"
                  />
                </div>
              </div>
              {post.user.name}
            </div>
          </Link>
          <div className="relative flex justify-end items-center">
            {userId === post.user.userId && (
              <Image
                src="/ellipsis-vertical.svg"
                alt="menu"
                width={24}
                height={24}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="cursor-pointer"
              />
            )}
            {isMenuOpen && userId === post.user.userId && (
              <div className="absolute top-12 bg-white rounded-2xl shadow-xs shadow-orange-400 p-2 min-w-24">
                <button
                  onClick={handleDelete}
                  className="text-red-500 px-4 py-2 w-full"
                >
                  削除
                </button>
              </div>
            )}
          </div>
        </div>
        <Link href={`/post/${post.postId}`}>
          <div className="py-2">
            <div className="w-100">
              <div className="flex flex-col gap-4">
                <div className="wrap-break-word">{post.content}</div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(true);
                  }}
                >
                  {post.thumbnail && (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(true);
                      }}
                    >
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="object-cover rounded-2xl"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
        <div className="py-4">
          {extractUrl(post.content) && (
            <LinkCard url={extractUrl(post.content)!} />
          )}
        </div>
      </div>

      <div className="flex gap-4 h-8">
        <button onClick={handleTree}>
          <div className="flex items-center justify-center gap-1">
            <Image
              src={cn(myTree ? "/tree.svg" : "/tree-pine.svg")}
              alt="tree"
              width={20}
              height={20}
            />
            {treeCount}
          </div>
        </button>
        <div className="flex items-center justify-center gap-1">
          <Image
            src={"/message-circle.svg"}
            alt="comments"
            width={20}
            height={20}
          />
          {post.comments.length}
        </div>
      </div>
      {isOpen && post.thumbnail && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src={post.thumbnail}
            alt={post.title}
            width={800}
            height={600}
            className="object-contain rounded-2xl"
          />
        </div>
      )}
    </div>
  );
}
