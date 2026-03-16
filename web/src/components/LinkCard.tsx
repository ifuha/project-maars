"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type OGP = {
  title: string;
  description: string;
  image: string;
};

type Props = {
  url: string;
};

export default function LinkCard({ url }: Props) {
  const [ogp, setOgp] = useState<OGP | null>(null);

  useEffect(() => {
    fetch(`/api/ogp?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then(setOgp)
      .catch(() => setOgp(null));
  }, [url]);

  if (!ogp || !ogp.title)
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-400 underline text-sm"
      >
        {url}
      </a>
    );

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="border-b border-orange-200 overflow-hidden flex gap-4">
        {ogp.image && (
          <div className="relative w-32 h-24 shrink-0">
            <Image
              src={ogp.image}
              alt={ogp.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col justify-center gap-1 p-3">
          <div className="font-bold text-sm">{ogp.title}</div>
          <div className="text-xs text-gray-500 line-clamp-2">
            {ogp.description}
          </div>
          <div className="text-xs text-orange-400">{url}</div>
        </div>
      </div>
    </a>
  );
}
