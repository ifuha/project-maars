"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, updateUser } from "@/lib/api/user";
import { getUserId } from "@/lib/utils/access-token";
import { uploadFile } from "@/lib/api/upLoad";
import type { User } from "@/lib/api/type";
import Image from "next/image";

export default function EditUserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [handle, sethandle] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);
  const [bio, setBio] = useState("");
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
      sethandle(u.handle || u.name);
      setBio(u.bio || "");
      setIconPreview(u.icon || null);
      setHeaderPreview(u.header || null);
    });
  }, [router]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeaderFile(file);
      setHeaderPreview(URL.createObjectURL(file));
    }
  };

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
        handle,
        icon: iconUrl,
        header: headerUrl,
        bio,
      });
      router.push(`/user/${userId}`);
    } catch (e) {
      setError("更新に失敗しました");
    }
  };

  if (!user)
    return <div className="flex justify-center p-10">読み込み中...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <div className="text-2xl font-bold flex items-centerr justify-center">
        プロフィール編集
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div>
        <div className="relative w-full h-40 bg-gray-100">
          {headerPreview && (
            <Image
              src={headerPreview}
              alt="Header"
              fill
              className="object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleHeaderChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-orange-400">
          {iconPreview && (
            <Image src={iconPreview} alt="Icon" fill className="object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleIconChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-bold text-gray-600">名前</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-2 border-orange-100 rounded-2xl p-3 outline-none"
        />
      </div>
      <div>
        <label className="text-sm font-bold text-gray-600">ハンドル</label>
        <input
          type="text"
          value={handle}
          onChange={(e) => sethandle(e.target.value)}
          className="w-full border-2 border-orange-100 rounded-2xl p-3 outline-none"
        />
      </div>
      <div>
        <label className="text-sm font-bold text-gray-600">自己紹介</label>
        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border-2 border-orange-100 rounded-2xl p-3 outline-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-orange-500 text-white font-bold rounded-2xl p-4 hover:bg-orange-600"
      >
        プロフィールを発行
      </button>
    </div>
  );
}
