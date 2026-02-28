"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, updateUser } from "@/lib/api/user";
import { getUserId } from "@/lib/utils/access-token";
import { uploadFile } from "@/lib/api/upLoad";
import type { User } from "@/lib/api/type";
import Link from "next/link";

export default function EditUserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      router.push("/login");
      return;
    }
    getUser(userId).then((u) => {
      setUser(u);
      setName(u.name);
    });
  }, []);

  const handleSubmit = async () => {
    try {
      const userId = getUserId();
      if (!userId || !user) return;

      let iconUrl = user.icon;
      let headerUrl = user.header;

      if (iconFile) iconUrl = await uploadFile(iconFile);
      if (headerFile) headerUrl = await uploadFile(headerFile);

      await updateUser(userId, {
        ...user,
        name,
        icon: iconUrl,
        header: headerUrl,
      });

      router.push(`/user/${userId}`);
    } catch (e) {
      setError("更新に失敗しました");
    }
  };

  if (!user) return <div>読み込み中...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">プロフィール編集</h1>
      {error && <p className="text-red-400">{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前"
        className="border border-orange-400 rounded-2xl p-2 w-80"
      />
      <div className="flex flex-col gap-2 w-80">
        <label>アイコン画像</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIconFile(e.target.files?.[0] || null)}
          className="border border-orange-400 rounded-2xl p-2"
        />
      </div>
      <div className="flex flex-col gap-2 w-80">
        <label>ヘッダー画像</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setHeaderFile(e.target.files?.[0] || null)}
          className="border border-orange-400 rounded-2xl p-2"
        />
      </div>
      <Link href={"/"}>
        <button
          onClick={handleSubmit}
          className="border border-orange-400 rounded-2xl p-2 w-80"
        >
          更新する
        </button>
      </Link>
    </div>
  );
}
