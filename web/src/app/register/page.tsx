"use client";

import { useState } from "react";
import { register } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (password !== confPassword) {
      setError("パスワードが一致しません");
      return;
    }
    try {
      await register({ name, email, password });
      router.push("/login");
    } catch (e) {
      setError("登録に失敗しました");
    }
  };
  return (
    <div>
      <div className="relative min-h-svh w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={"/background.jpg"}
            alt="background"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 flex justify-start text-white font-bold text-9xl wrap-break-word">
          <div className="w-150 p-4">Maars Ticket Creation</div>
        </div>
        <div className="relative z-10 flex justify-end items-center min-h-svh">
          <div className="flex flex-col items-center justify-center h-svh gap-12 bg-white rounded-l-3xl p-12 font-bold">
            <div className="wrap-break-word">アカウントを作成</div>
            新規登録
            {error && <div className="text-red-500">{error}</div>}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border border-orange-400 rounded-xl p-2 w-80"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-orange-400 rounded-xl p-2 w-80"
            />
            <input
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border border-orange-400 p-2 rounded-xl w-80"
            />
            <input
              placeholder="パスワードを確認"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              className="bg-white border border-orange-400 p-2 rounded-xl w-80"
            />
            <button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-400 text-white rounded-2xl p-2 w-40"
            >
              登録
            </button>
            <a href="/login" className="underline ml-1 hover:text-orange-400">
              ログイン
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;
