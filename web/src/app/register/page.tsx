"use client";

import { useState } from "react";
import { register } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, ssetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await register({ name, email, password });
      router.push("/login");
    } catch (e) {
      setError("登録に失敗しました");
    }
  };
  return (
    <div>
      <div></div>
    </div>
  );
}
export default RegisterPage;
