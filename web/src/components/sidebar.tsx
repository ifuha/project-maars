"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getUserId, removeToken } from "@/lib/utils/access-token";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";
import type { User } from "@/lib/api/type";
import { getUser } from "@/lib/api/user";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentId = getUserId();
    setUserId(currentId);

    if (currentId) {
      getUser(currentId)
        .then(setUser)
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <>
      <div className="hidden md:flex flex-col items-start gap-12 m-4 h-screen fixed left-0 top-0">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/rocket.svg" alt="logo" width={40} height={40} />
            <div className={cn(pathname === "/" && "text-orange-400")}>
              Rocket
            </div>
          </div>
        </Link>
        <Link href="/topic">
          <div className="flex items-center gap-2">
            <Image src="/sparkle.svg" alt="topic" width={40} height={40} />
            <div className={cn(pathname === "/topic" && "text-orange-400")}>
              トピック
            </div>
          </div>
        </Link>
        <Link href="/explore">
          <div className="flex items-center gap-2">
            <Image src="/search.svg" alt="search" width={40} height={40} />
            <div className={cn(pathname === "/explore" && "text-orange-400")}>
              検索
            </div>
          </div>
        </Link>
        {userId && (
          <Link href="/post/create">
            <div className="flex items-center gap-2">
              <Image src="/post.svg" alt="post" width={40} height={40} />
              <div
                className={cn(pathname === "/post/create" && "text-orange-400")}
              >
                投稿
              </div>
            </div>
          </Link>
        )}
        {userId && (
          <Link href={`/user/${userId}`}>
            <div className="flex items-center gap-2">
              <Image src="/user.svg" alt="profile" width={40} height={40} />
              <div
                className={cn(
                  pathname === `/user/${userId}` && "text-orange-400",
                )}
              >
                プロフィール
              </div>
            </div>
          </Link>
        )}
        {userId ? (
          <button onClick={handleLogout}>
            <div className="flex items-center gap-2">
              <Image src="/log-out.svg" alt="logout" width={40} height={40} />
              ログアウト
            </div>
          </button>
        ) : (
          <Link href="/login">
            <div className="flex items-center gap-2">
              <Image src="/log-in.svg" alt="login" width={40} height={40} />
              ログイン
            </div>
          </Link>
        )}
        <div className="border-t border-orange-400 w-full">
          <Link href="/user/edit">
            {user && (
              <div className="flex items-center gap-2 py-4">
                <div className="rounded-full overflow-hidden w-10 h-10">
                  <Image
                    src={user.icon || "/rocket.svg"}
                    alt="Icon"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div>{user.name}</div>
                  プロフィールの編集
                </div>
              </div>
            )}
          </Link>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-400 flex justify-around items-center h-16 z-50">
        <Link href="/">
          <Image src="/rocket.svg" alt="home" width={32} height={32} />
        </Link>
        <Link href="/topic">
          <Image src="/sparkle.svg" alt="topic" width={32} height={32} />
        </Link>
        <Link href="/explore">
          <Image src="/search.svg" alt="search" width={32} height={32} />
        </Link>
        {userId && (
          <Link href="/post/create">
            <Image src="/post.svg" alt="post" width={32} height={32} />
          </Link>
        )}
        <Link href={`/user/${userId}`}>
          {user && (
            <div className="flex items-center gap-2 py-4">
              <div className="rounded-full overflow-hidden w-10 h-10">
                <Image
                  src={user.icon || "/rocket.svg"}
                  alt="Icon"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
        </Link>
      </div>
    </>
  );
}
