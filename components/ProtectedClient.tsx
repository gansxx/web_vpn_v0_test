import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 通过后端 /me 接口验证（后端从 cookie 读取 token 或客户端附带 token）
    fetch("/me", { credentials: "include" })
      .then((r) => {
        if (r.status === 200) return r.json();
        throw new Error("unauth");
      })
      .then(() => setChecking(false))
      .catch(() => router.push("/signin"));
  }, [router]);

  if (checking) return null;
  return <>{children}</>;
}