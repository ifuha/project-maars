import { getPosts } from "@/lib/api/post";
import PostCard from "@/components/PostCard";
import { Post } from "@/lib/api/type";

const testPosts: Post[] = [
  {
    postId: 1,
    userId: 1,
    title: "テスト投稿1",
    content: "テストコンテンツ1",
    thumbnail: "https://picsum.photos/400/200?random=1",
    isPrivate: false,
    user: {
      userId: 1,
      name: "テストユーザー1",
      email: "test1@test.com",
      icon: "https://picsum.photos/24/24?random=1",
      header: "",
      posts: [],
      trees: [],
      comments: [],
    },
    comments: [],
    postTags: [],
  },
  {
    postId: 2,
    userId: 2,
    title: "テスト投稿2",
    content: "https://tailwindcss.com/",
    thumbnail: "https://picsum.photos/400/200?random=2",
    isPrivate: false,
    user: {
      userId: 2,
      name: "テストユーザー2",
      email: "test2@test.com",
      icon: "",
      header: "",
      posts: [],
      trees: [],
      comments: [],
    },
    comments: [],
    postTags: [],
  },
];

export default function Home() {
  // const posts = getPosts();
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4">
        {testPosts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
}
