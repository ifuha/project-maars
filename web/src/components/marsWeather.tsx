"use client";

import React from "react";
import { useEffect, useState } from "react";
import { getMarsWeathers } from "@/lib/api/marsWeather";
import type { MarsWeather } from "@/lib/api/type";
import { useMediaQuery } from "react-responsive";

export default function MarsWeather() {
  const [weathers, setWeathers] = useState<MarsWeather[]>([]);

  useEffect(() => {
    getMarsWeathers().then(setWeathers);
  }, []);

  const Responsive: boolean = useMediaQuery({ query: "(max-width: 760px)" });

  if (!Responsive) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="font-bold flex flex-col gap-12">
          <div className="hover:text-orange-400 border-b border-orange-400">
            火星
          </div>
          {weathers.map((w) => (
            <div key={w.id} className="flex flex-col gap-4">
              <div>
                火星日: {w.sol}日 平均気温: {w.tempAvg.toFixed(1)}°C
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
