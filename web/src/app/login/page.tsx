"use client";

import { useState } from "react";
import { login } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await login({ email, password });
      router.push("/");
    } catch (e) {
      setError("メールアドレスまたはパスワードが違います");
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
          <div className="w-170 p-4">Spaceship And Head To Maars!!</div>
        </div>
        <div className="relative z-10 flex justify-end items-center min-h-svh">
          <div className="flex flex-col items-center justify-center h-svh gap-12 bg-white rounded-l-3xl p-12 font-bold">
            <div className="flex items-center">
              ログイ
              <a href="/" className="hover:text-orange-400">
                ン
              </a>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-orange-400 rounded-xl p-2 w-80"
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border border-orange-400 p-2 rounded-xl w-80"
            />
            <button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-400 text-white rounded-2xl p-2 w-40"
            >
              Sailor!!
            </button>
            <a
              href="/register"
              className="underline ml-1 hover:text-orange-400"
            >
              新規登録
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
