"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getUserId, removeToken } from "@/lib/utils/access-token";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <div className="flex flex-col items-end gap-6 h-screen">
      <div className="flex flex-col items-start gap-12 m-4">
        <Link href={"/"}>
          <div className="flex items-center justify-between gap-2">
            <Image src={"/rocket.svg"} alt="logo" width={40} height={40} />
            <div className={cn(pathname == "/" && "text-orange-400")}>
              Rocket
            </div>
          </div>
        </Link>
        <Link href={"/explore"}>検索</Link>
        {userId && (
          <Link href={"/post/create"}>
            <div
              className={cn(pathname == "/post/create" && "text-orange-400")}
            >
              投稿
            </div>
          </Link>
        )}
        {userId && (
          <Link href={`/user/${userId}`}>
            <div
              className={cn(pathname == `/user/${userId}` && "text-orange-400")}
            >
              プロフィール
            </div>
          </Link>
        )}
        {userId ? (
          <button onClick={handleLogout}>ログアウト</button>
        ) : (
          <Link href="/login">ログイン</Link>
        )}
      </div>
    </div>
  );
}
