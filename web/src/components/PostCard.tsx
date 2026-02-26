import { Post } from "@/lib/api/type";
import Image from "next/image";
import Link from "next/link";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  return (
    <Link href={`/post/${post.postId}`}>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center gap-2">
          {post.user.name}
          <Image
            src={post.user.icon || "/placeholder.png"}
            alt={post.user.name}
            width={24}
            height={24}
          />
        </div>
        <div>
          <Image
            src={post.thumbnail || "/placeholder.png"}
            alt={post.title}
            width={400}
            height={200}
            className="object-cover"
          />
        </div>
      </div>
    </Link>
  );
}
