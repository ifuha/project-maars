"use client";

import { Post } from "@/lib/api/type";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);
  return (
    <div className="border-b border-orange-400">
      <Link href={`/post/${post.postId}`}>
        <div className="flex flex-col items-start justify-start gap-4 rounded-2xl">
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
        </div>
      </Link>
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
