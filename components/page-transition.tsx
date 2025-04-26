"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "../app/page-transitions.css";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsEntering(true);
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <div className={`page-transition ${isEntering ? "page-enter" : ""}`}>
      {children}
    </div>
  );
}
