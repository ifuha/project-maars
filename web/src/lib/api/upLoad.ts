import { getToken } from "../utils/access-token";

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = getToken();
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) throw new Error("アップロードに失敗しました");
  const data = await res.json();
  return data.url;
};
