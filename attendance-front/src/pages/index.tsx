import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ログインページにリダイレクト
    router.push("/Login");
  }, [router]);

  return null; // 何も表示しない
}
