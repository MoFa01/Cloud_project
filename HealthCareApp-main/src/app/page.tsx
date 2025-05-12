"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "./_components/Loader/Loader";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/login");
    }, 5000); // 5 seconds

    return () => clearTimeout(timeout);
  }, [router]);

  return <Loader />;
}
